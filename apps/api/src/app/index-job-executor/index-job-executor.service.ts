import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { Connection } from 'typeorm';
import { inspect } from 'util';
import { environment } from '../../environments/environment';
import JobInProgress from '../index-common/entities/job-in-progress.entity';
import QueuedJob from '../index-common/entities/queued-job.entity';
import { IndexMessageScannerService } from '../index-message-scanner/index-message-scanner.service';
import FinishedJob from '../index-common/entities/finished-job.entity';
import formatGuildChannelIds from '../utils/format-guild-channel-ids';

export interface JobInExecution {
  promise: Promise<void>,
  job: JobInProgress
}

@Injectable()
export class IndexJobExecutorService {
  constructor(
    private connection: Connection,
    private indexMessageScanner: IndexMessageScannerService
  ) {}

  private jobsInExecution: JobInExecution[] = [];
  private logger = new Logger("IndexJobExecutor");

  @Cron(CronExpression.EVERY_10_SECONDS)
  async makeTheShitHappen() {
    if (this.jobsInExecution.length >= environment.concurrentScanJobs) {
      return;
    }

    // Get last job from queue
    const jobInQueue = await this.connection.manager.findOne(QueuedJob, {
      order: {
        queuedAt: 'ASC'
      }
    });

    if (jobInQueue) {
      this.logger.log("Found job in queue, executing...");
      await this.executeJob(jobInQueue);
    }
  }

  @Timeout(1000)
  async resumeJobsInProgress() {
    const jobsInProgress = await this.connection.manager.find(JobInProgress);
    if (jobsInProgress.length > 0) {
      this.logger.log(`Found ${jobsInProgress.length} job that was executing before app exited. Resuming them...`);
      jobsInProgress.forEach(job => this.resumeJob(job));
    }
  }

  async resumeJob(job: JobInProgress): Promise<JobInExecution> {
    const scanPromise = this.indexMessageScanner.scan(job);
    const jobInExecution: JobInExecution = {
      job: job,
      promise: scanPromise
    }
    this.jobsInExecution.push(jobInExecution);

    scanPromise
    .then(() => this.handleJobFinish(jobInExecution))
    .catch(error => this.handleJobFinish(jobInExecution, error));

    return jobInExecution;
  }

  async executeJob(job: QueuedJob): Promise<JobInExecution> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const jobToExecute = JobInProgress.fromQueuedJob(job);
      await queryRunner.manager.save(jobToExecute);
      await queryRunner.manager.remove(job);
      await queryRunner.commitTransaction();

      const scanPromise = this.indexMessageScanner.scan(jobToExecute);
      const jobInExecution: JobInExecution = {
        job: jobToExecute,
        promise: scanPromise
      };
      this.jobsInExecution.push(jobInExecution);

      scanPromise
      .then(() => this.handleJobFinish(jobInExecution))
      .catch(error => this.handleJobFinish(jobInExecution, error));

      return jobInExecution;
    }
    catch(err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error while trying to execute job for ${formatGuildChannelIds(job.guildId, job.channelId)}. Err: ${inspect(err)}`);
      throw err;
    }
    finally {
      await queryRunner.release();
    }
  }

  async handleJobFinish(job: JobInExecution, error?, renewTry = 0) {
    if (!error) {
      this.logger.log(`Scanning job ${job.job.id} finished.`);
    }
    else {
      this.logger.error(inspect(error));
      this.logger.error(`Scanning job ${job.job.id} errored.`);
    }

    const idx = this.jobsInExecution.findIndex(v => v.job.id === job.job.id);
    if (idx === -1) {
      this.logger.warn(`Did not found job ${job.job.id} in jobsInExecution array. This shouldn't happen and needs investigation.`);
      return;
    }
    this.jobsInExecution.splice(idx, 1);
    const finishedJob = FinishedJob.fromJobInProgress(job.job);

    if (!error) {
      finishedJob.finish();
    }
    else {
      finishedJob.finish(inspect(error));
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.remove(job.job);
      await queryRunner.manager.save(finishedJob);
      await queryRunner.commitTransaction();
    }
    catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error when trying to finish job ID: ${job.job.id}, ERR: ${inspect(err)}`);
      if (renewTry < 3) {
        this.logger.log(`Trying again to finish job: ${job.job.id}...`);
        this.handleJobFinish(job, error, renewTry + 1);
      } else {
        this.logger.error(`Tried to finish job ID: ${job.job.id} 3 times and failed. Giving up on this one...`);
      }
    }
    finally {
      await queryRunner.release();
    }
  }
}
