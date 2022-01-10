import { Logger } from '@nestjs/common';
import { environment } from '../../../environments/environment';
import { Channel, Client, DiscordAPIError, Guild, Intents, Message } from 'discord.js';
import EventEmitter = require('events');
import { IndexSchedulerService } from '../../index-scheduler/index-scheduler.service';
import { LinksService } from '../../links/links.service';
import IChannel from '../channel';
import BotNotInGuildError from './errors/bot-not-in-guild';
import ChannelIsNotTextChannelError from './errors/channel-is-not-text-channel';
import NoAccessToChannelError from './errors/no-access-to-channel';

/**
 * Discord bot providing communication with Discord and reacting to discord users' commands.
 */
export class DiscordBot extends EventEmitter {
  private client: Client;
  private logger = new Logger("DiscordBot");

  constructor(private linksService: LinksService, private indexShedulerService: IndexSchedulerService) {
    super();
    this.client = new Client({
      intents: this.getAllUnpriviligedIntents(),
      partials: ['CHANNEL', 'MESSAGE', 'REACTION']
    });
  }

  public async start() {
    this.logger.log("Logging into discord bot...");

    if (!process.env.DISCORD_TOKEN) {
      this.logger.error("YOU MUST SET DISCORD_TOKEN ENVIRONMENT VARIABLE TO YOUR API DISCORD TOKEN");
      process.exit(1);
    }

    try {
      await this.client.login(process.env.DISCORD_TOKEN);
    }
    catch(err) {
      this.logger.error('Failed to login to Discord bot!!! Throwing error');
      throw err;
    }

    this.client.on('ready', e => {
      this.logger.log(`Logged in to Discord as ${e.user.tag}`);
    });

    this.client.on('error', err => {
      this.logger.error(err);
    });

    this.bindMessageEventListeners();
  }

  public async getGuildById(guildId: string): Promise<Guild> {
    if (await this.isInGuild(guildId)) {
      return this.client.guilds.fetch(guildId);
    }
    return null;
  }

  public async getChannelById(guild: Guild, channelId: string): Promise<Channel> {
    if (await this.hasAccessToChannel(guild, channelId)) {
      return guild.channels.fetch(channelId);
    }
    return null;
  }

  private bindMessageEventListeners() {
    this.client.on('messageCreate', msg => {
      this.logger.debug(`MessageCreate: <${msg.author.tag}> ${msg.content}`);
      if (msg.author.id === this.client.user.id) {
        return;
      }
      this.handleMessage(msg);

      this.emit('messageCreate', msg);
    });

    this.client.on('messageDelete', msg => {
      this.logger.debug(`MessageDelete: (${msg.id}) <${msg?.author?.tag}> ${msg?.content}`);

      this.emit('messageDelete', msg);
    });

    this.client.on('messageUpdate', (oldMsg, newMsg) => {
      this.logger.debug(`MessageUpdate: <${newMsg.author.tag}> ${oldMsg.content}\nchanged to\n${newMsg.content}`);

      this.emit('messageUpdate', oldMsg, newMsg);
    });
  }

  public on(event: 'messageCreate', listener: (message: Message) => void): this;
  public on(event: 'messageDelete', listener: (message: Message) => void): this;
  public on(event: 'messageUpdate', listener: (oldMessage: Message, newMessage: Message) => void): this;
  public on(event, listener): this {
    return super.on(event, listener);
  }

  public async hasAccessToChannel(guild: Guild, channelId: string): Promise<boolean> {
    try {
      await guild.channels.fetch(channelId);
      return true;
    }
    catch(err) {
      if (err instanceof DiscordAPIError) {
        this.logger.warn(`Failed to access channel ${channelId} on guild ${guild.id} (${guild.name}). Err: { code: ${err.code}, status: ${err.httpStatus}, message: ${err.message} }`);
        return false;
      }

      this.logger.error("Error while checking if bot has access to channel! Throwing error");
      throw err;
    }
  }

  public async isInGuild(guildId: string): Promise<boolean> {
    try {
      await this.client.guilds.fetch(guildId);
      return true;
    }
    catch (err) {
      if (err instanceof DiscordAPIError && err.code === 50001 /* Missing Access */) {
        this.logger.warn(`Failed accessing guild, probably bot isn't it that guild. Guild ID: ${guildId}`);
        return false;
      }

      this.logger.error("Error while checking if bot is in guild!");
      throw err;
    }
  }

  public async getMessages(guildId: string, channelId: string, limit = 100, before?: string): Promise<Message[]> {
    if (await this.isInGuild(guildId) === false) {
      this.logger.error(`Trying to read messages for guild that bot has no access to. GuildId: ${guildId}`);
      throw new BotNotInGuildError(guildId);
    }

    const guild = await this.client.guilds.fetch(guildId);

    if (await this.hasAccessToChannel(guild, channelId) === false) {
      this.logger.error(`Trying to read messages for channel that bot has no access to. GuildId: ${guildId} (${guild.name}), Channel ${channelId}`);
      throw new NoAccessToChannelError(guild, channelId);
    }

    const channel = await guild.channels.fetch(channelId);
    if (channel.type !== 'GUILD_TEXT') {
      throw new ChannelIsNotTextChannelError(guild, channel);
    }

    const messages = await channel.messages.fetch({ limit, before });
    if (messages.size === 0) {
      return [];
    }

    return Array.from(messages.values());
  }

  public async getGuildChannelList(guildId: string): Promise<IChannel[]> {
    if (await this.isInGuild(guildId) === false) {
      this.logger.error(`Trying to read channel list for guild that bot has no access to. GuildId: ${guildId}`);
      throw new BotNotInGuildError(guildId);
    }

    const guild = await this.client.guilds.fetch(guildId);
    const guildChannels = await guild.channels.fetch();
    const textChannels = guildChannels
    .filter(channel => channel.type === "GUILD_TEXT")
    .map<IChannel>((value, key) => {
      return { name: value.name, snowflake: key }
    });

    return textChannels;
  }

  private async handleMessage(message: Message) {
    if (message.content.startsWith("$>gallery")) {
      await message.channel.sendTyping();
      const link = await this.linksService.createLink(message.guildId, message.channelId);
      await message.channel.send(link);
    }
    if (message.content.startsWith("$>idx") && environment.production === false) {
      //const searchedMessage = await message.channel.messages.fetch({ after: message.id, limit: 1 });
      message.channel.send(`<@${message.author.id}> starting full index of this channel...`);
      this.indexShedulerService.scheduleScanJob(message.guildId, message.channelId);
    }
  }

  /**
   * Discord has some intents that requires bot verification.
   * Like listing all guild members. I guess everyone knows why bot needs verification in this case.
   * Anyways I don't need that information so I just get all intents without priviliged.
   */
  private getAllUnpriviligedIntents() {
    return [
      ...Object.values(Intents.FLAGS)
      .filter(flag => ![Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES]
        .includes(flag)
      )
    ]
  }
}
