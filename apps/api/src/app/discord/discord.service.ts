import { Inject, Injectable } from '@nestjs/common';
import { DiscordBot } from './discord-bot/discord-bot';

@Injectable()
export class DiscordService {
  constructor(@Inject('DiscordBot') private discordBot: DiscordBot) {}

  public async isInGuild(guildId: string) {
    return this.discordBot.isInGuild(guildId);
  }

  public async getGuildChannelList(guildId: string) {
    return this.discordBot.getGuildChannelList(guildId);
  }
}
