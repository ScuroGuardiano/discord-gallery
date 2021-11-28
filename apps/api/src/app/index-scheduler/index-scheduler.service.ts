import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'typeorm';
import { inspect } from 'util';
import QueuedJob from '../index-common/entities/queued-job.entity';
import formatGuildChannelIds from '../utils/format-guild-channel-ids';
import JobAlreadyEnqueuedError from './errors/job-already-enqueued';

@Injectable()
export class IndexSchedulerService {
  constructor(
    private connection: Connection,
  ) {}

  private logger = new Logger(IndexSchedulerService.name);

  public async scheduleScanJob(guildId: string, channelId: string) {
    this.logger.debug(`Enqueueing job for ${formatGuildChannelIds(guildId, channelId)}...`);

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    // ------------------------- T R A N S A C T I O N   S T A R T -------------------------
    try {
      const jobsEnqueued = await queryRunner.manager.count(QueuedJob, { where: {
        guildId: guildId,
        channelId: channelId
      }});

      if (jobsEnqueued > 0) {
        this.logger.warn(`Tried to enqueue job that is already in queue. ${formatGuildChannelIds(guildId, channelId)}.`);
        throw new JobAlreadyEnqueuedError(guildId, channelId);
      }

      this.logger.debug(`There are no job in queue for ${formatGuildChannelIds(guildId, channelId)}. Adding to queue...`);

      const job = QueuedJob.create(guildId, channelId);
      await queryRunner.manager.save(job);
      await queryRunner.commitTransaction();

      this.logger.debug(`Job for ${formatGuildChannelIds(guildId, channelId)} has been added to queue.`)
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
}
