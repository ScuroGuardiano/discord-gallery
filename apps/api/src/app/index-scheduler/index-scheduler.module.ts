import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import QueuedJob from '../index-common/entities/queued-job.entity';
import { IndexSchedulerService } from './index-scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([ QueuedJob ])],
  providers: [IndexSchedulerService],
  exports: [IndexSchedulerService]
})
export class IndexSchedulerModule {}
