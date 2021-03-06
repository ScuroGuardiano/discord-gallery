import { Module } from '@nestjs/common';
import { IndexSchedulerModule } from '../index-scheduler/index-scheduler.module';
import { LinksModule } from '../links/links.module';
import { discordBotFactory } from './discord-bot/discord-bot.factory';
import { DiscordService } from './discord.service';

/**
 * Module providing services to communicate with Discord Bot
 */
@Module({
  providers: [DiscordService, discordBotFactory],
  imports: [LinksModule, IndexSchedulerModule],
  exports: [DiscordService]
})
export class DiscordModule {}
