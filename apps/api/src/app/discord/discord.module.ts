import { Module } from '@nestjs/common';
import { LinksModule } from '../links/links.module';
import { discordBotFactory } from './discord-bot/discord-bot.factory';
import { DiscordService } from './discord.service';

/**
 * Module providing services to communicate with Discord Bot
 */
@Module({
  providers: [DiscordService, discordBotFactory],
  imports: [LinksModule],
  exports: [DiscordService]
})
export class DiscordModule {}
