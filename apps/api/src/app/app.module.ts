import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from './discord/discord.module';
import { LinksModule } from './links/links.module';
import { GuildsModule } from './guilds/guilds.module';
import { IndexManagerModule } from './index-manager/index-manager.module';
import { IndexMessageScannerModule } from './index-message-scanner/index-message-scanner.module';
import { IndexMessageListenerModule } from './index-message-listener/index-message-listener.module';
import { IndexSchedulerModule } from './index-scheduler/index-scheduler.module';
import { IndexJobExecutorModule } from './index-job-executor/index-job-executor.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "./db.sqlite",
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === "development"
    }),
    DiscordModule,
    LinksModule,
    GuildsModule,
    IndexManagerModule,
    IndexMessageScannerModule,
    IndexMessageListenerModule,
    IndexSchedulerModule,
    IndexJobExecutorModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
