import { Injectable, Logger } from '@nestjs/common';
import { Connection, EntityManager, LessThan } from 'typeorm';
import { inspect } from 'util';
import { environment } from '../../environments/environment';
import FinishedJob from '../index-common/entities/finished-job.entity';
import JobInProgress from '../index-common/entities/job-in-progress.entity';
import QueuedJob from '../index-common/entities/queued-job.entity';
import formatGuildChannelIds from '../utils/format-guild-channel-ids';
import JobAlreadyEnqueuedError from './errors/job-already-enqueued';
import JobAlreadyRunningError from './errors/job-already-running';
import RescanOnCooldownError from './errors/rescan-on-cooldown';
import { IJobStatus, JOB_STATUSES } from './job-statuses';

@Injectable()
export class IndexSchedulerService {
  constructor(
    private connection: Connection,
  ) {}

  private logger = new Logger(IndexSchedulerService.name);

  public async scheduleScanJob(guildId: string, channelId: string): Promise<QueuedJob> {
    this.logger.debug(`Enqueueing job for ${formatGuildChannelIds(guildId, channelId)}...`);

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    // ------------------------- T R A N S A C T I O N   S T A R T -------------------------
    try {
      if (!(await this.canScheduleJob(queryRunner.manager, guildId, channelId))) {
        throw new Error("Validation error");
      }

      this.logger.debug(`There are no job in queue for ${formatGuildChannelIds(guildId, channelId)}. Adding to queue...`);

      const job = QueuedJob.create(guildId, channelId);
      await queryRunner.manager.save(job);
      await queryRunner.commitTransaction();

      this.logger.debug(`Job for ${formatGuildChannelIds(guildId, channelId)} has been added to queue.`)
      return job;
    }
    catch(err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Transaction failed, err: ${inspect(err)}, re-throwing this bad bitch`);
      throw err;
    }
    finally {
      await queryRunner.release();
    }
    // --------------------------- T R A N S A C T I O N   E N D ---------------------------
  }

  private async canScheduleJob(manager: EntityManager, guildId: string, channelId: string): Promise<boolean> {
    const jobsEnqueued = await manager.count(QueuedJob, { where: {
      guildId, channelId
    }});

    if (jobsEnqueued > 0) {
      this.logger.warn(`Tried to enqueue job that is already in queue. ${formatGuildChannelIds(guildId, channelId)}.`);
      throw new JobAlreadyEnqueuedError(guildId, channelId);
    }

    const jobInProgress = await manager.findOne(JobInProgress, { where: {
      guildId, channelId
    }});

    if (jobInProgress) {
      this.logger.warn(`Tried to enqueue job that is already in progress. ${formatGuildChannelIds(guildId, channelId)}`);
      throw new JobAlreadyRunningError(guildId, channelId);
    }

    const finishedJob = await manager.findOne(FinishedJob, {
      where: { guildId, channelId },
      order: { finishTime: 'DESC' }
    });

    if (finishedJob) {
      const timeDiff = Date.now() - finishedJob.finishTime.getTime();
      this.logger.warn(`Tried to enqueue job that was finished in less than rescan cooldown: ${environment.rescanCooldown / 1000} seconds. ${formatGuildChannelIds(guildId, channelId)}`);
      if (timeDiff < environment.rescanCooldown) {
        throw new RescanOnCooldownError(guildId, channelId);
      }
    }

    return true;
  }

  public async getStatusOfJob(queuedJobId: number): Promise<IJobStatus> {
    const queuedJob = await this.connection.manager.findOne(QueuedJob, queuedJobId);
    if (queuedJob) {
      const positionInQueue = await this.connection.manager.count(QueuedJob, {
        order: { queuedAt: 'ASC' },
        where: { queuedAt: LessThan(queuedJob.queuedAt) }
      });

      return {
        status: JOB_STATUSES.QUEUED,
        positionInQueue: positionInQueue + 1
      }
    }

    // Well the job is not in queue, maybe it's running
    const jobInProgress = await this.connection.manager.findOne(JobInProgress, {
      where: { queuedJobId: queuedJobId }
    });
    if (jobInProgress) {
      return {
        status: JOB_STATUSES.RUNNING,
        scannedMessages: jobInProgress.scannedMessages
      }
    }

    // Well so the job must be finished!
    const finishedJob = await this.connection.manager.findOne(FinishedJob, {
      where: { queuedJobId: queuedJobId }
    });

    if (finishedJob) {
      return {
        status: JOB_STATUSES.FINISHED
      }
    }

    return { status: JOB_STATUSES.NOT_FOUND }
  }

  /**
   * Will return queueJobId for given guildId and channelId. If not found it will return negative value.
   *
   * @param guildId
   * @param channelId
   *
   * @returns negative value if job was not found
   */
  public async getQueueJobIdByGuildChannel(guildId: string, channelId: string): Promise<number> {
    // Now I see that splitting that guys into 3 tables was bad idea
    const queuedJob = await this.connection.manager.findOne(QueuedJob, {
      where: {
        guildId, channelId
      }
    });
    if (queuedJob) {
      return queuedJob.id;
    }

    const jobInProgress = await this.connection.manager.findOne(JobInProgress, {
      where: {
        guildId, channelId
      }
    });
    if (jobInProgress) {
      return jobInProgress.queuedJobId;
    }

    const finishedJob = await this.connection.manager.findOne(FinishedJob, {
      where: {
        guildId, channelId
      }
    });
    if (finishedJob) {
      return finishedJob.queuedJobId;
    }

    return -1337;
  }
}
