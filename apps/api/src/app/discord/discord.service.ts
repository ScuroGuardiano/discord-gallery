import { Inject, Injectable } from '@nestjs/common';
import { Message } from 'discord.js';
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

  public async getMessages(guildId: string, channelId: string, limit = 100, before?: string): Promise<Message[]> {
    return this.discordBot.getMessages(guildId, channelId, limit, before);
  }
}
