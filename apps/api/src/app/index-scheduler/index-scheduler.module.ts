import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import FinishedJob from '../index-common/entities/finished-job.entity';
import JobInProgress from '../index-common/entities/job-in-progress.entity';
import QueuedJob from '../index-common/entities/queued-job.entity';
import { IndexSchedulerService } from './index-scheduler.service';
import { IndexSchedulerController } from './index-scheduler.controller';
import { LinksModule } from '../links/links.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ QueuedJob, JobInProgress, FinishedJob ]),
    LinksModule
  ],
  providers: [IndexSchedulerService],
  exports: [IndexSchedulerService],
  controllers: [IndexSchedulerController]
})
export class IndexSchedulerModule {}
