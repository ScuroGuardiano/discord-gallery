import { Inject, Injectable } from '@nestjs/common';
import { Guild, Message } from 'discord.js';
import EventEmitter = require('events');
import { DiscordBot } from './discord-bot/discord-bot';

@Injectable()
export class DiscordService extends EventEmitter {
  constructor(@Inject('DiscordBot') private discordBot: DiscordBot) {
    super();
    this.discordBot.on('messageCreate', msg => this.emit('messageCreate', msg));
    this.discordBot.on('messageUpdate', (oldMsg, newMsg) => this.emit('messageUpdate', oldMsg, newMsg));
    this.discordBot.on('messageDelete', msg => this.emit('messageDelete', msg));
  }

  public async isInGuild(guildId: string) {
    return this.discordBot.isInGuild(guildId);
  }

  public async getGuildChannelList(guildId: string) {
    return this.discordBot.getGuildChannelList(guildId);
  }

  public async getGuildById(guildId: string) {
    return this.discordBot.getGuildById(guildId);
  }

  public async getChannelById(guild: Guild, channelId: string) {
    return this.discordBot.getChannelById(guild, channelId);
  }

  public async getMessages(guildId: string, channelId: string, limit = 100, before?: string): Promise<Message[]> {
    return this.discordBot.getMessages(guildId, channelId, limit, before);
  }

  public on(event: 'messageCreate', listener: (message: Message) => void): this;
  public on(event: 'messageDelete', listener: (message: Message) => void): this;
  public on(event: 'messageUpdate', listener: (oldMessage: Message, newMessage: Message) => void): this;
  public on(event, listener): this {
    return super.on(event, listener);
  }
}
