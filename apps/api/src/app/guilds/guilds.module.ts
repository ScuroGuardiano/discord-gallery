import { Module } from '@nestjs/common';
import { DiscordModule } from '../discord/discord.module';
import { IndexManagerModule } from '../index-manager/index-manager.module';
import { IndexSchedulerModule } from '../index-scheduler/index-scheduler.module';
import { LinksModule } from '../links/links.module';
import { GuildsController } from './guilds.controller';

@Module({
  controllers: [GuildsController],
  imports: [
    LinksModule,
    DiscordModule,
    IndexManagerModule,
    IndexSchedulerModule
  ]
})
export class GuildsModule {}
