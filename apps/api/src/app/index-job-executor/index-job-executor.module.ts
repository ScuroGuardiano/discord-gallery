import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import FinishedJob from '../index-common/entities/finished-job.entity';
import JobInProgress from '../index-common/entities/job-in-progress.entity';
import QueuedJob from '../index-common/entities/queued-job.entity';
import { IndexMessageScannerModule } from '../index-message-scanner/index-message-scanner.module';
import { IndexJobExecutorService } from './index-job-executor.service';

@Module({
  imports: [
    IndexMessageScannerModule,
    TypeOrmModule.forFeature([ JobInProgress, QueuedJob, FinishedJob ])
  ],
  providers: [IndexJobExecutorService]
})
export class IndexJobExecutorModule {}
