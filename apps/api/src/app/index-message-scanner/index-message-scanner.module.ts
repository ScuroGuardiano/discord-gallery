import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordModule } from '../discord/discord.module';
import JobInProgress from '../index-common/entities/job-in-progress.entity';
import { IndexManagerModule } from '../index-manager/index-manager.module';
import { IndexMessageScannerService } from './index-message-scanner.service';

@Module({
  imports: [
    DiscordModule,
    TypeOrmModule.forFeature([ JobInProgress ]),
    IndexManagerModule
  ],
  providers: [IndexMessageScannerService],
  exports: [IndexMessageScannerService]
})
export class IndexMessageScannerModule {}
