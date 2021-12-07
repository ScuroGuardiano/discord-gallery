import { Injectable, Logger } from '@nestjs/common';
import { Message } from 'discord.js';
import { inspect } from 'util';
import { DiscordService } from '../discord/discord.service';
import { IndexManagerService } from '../index-manager/index-manager.service';
import formatGuildChannelIds from '../utils/format-guild-channel-ids';

@Injectable()
export class IndexMessageListenerService {
  constructor(
    private discord: DiscordService,
    private indexManager: IndexManagerService
  ) {
    this.discord.on('messageCreate', this.handleMessageCreate.bind(this));
    this.discord.on('messageUpdate', this.handleMessageUpdate.bind(this));
    this.discord.on('messageDelete', this.handleMessageDelete.bind(this));
  }

  private logger = new Logger('IndexMessageListener');

  private async handleMessageCreate(message: Message) {
    try {
      if (message.attachments.size > 0) {
        this.logger.debug(`Indexing message: ${message.id}, on ${formatGuildChannelIds(message.guildId, message.channelId)}`);
        await this.indexManager.indexMessage(message);
      }
    }
    catch (err) {
      this.logger.error(`Failed to index message: ${message.id}, on ${formatGuildChannelIds(message.guildId, message.channelId)}.
      \nIndex may be now invalid, running full index job is recommended
      \nError: ${inspect(err)}`);
    }
  }

  private async handleMessageUpdate(oldMessage: Message, newMessage: Message) {
    try {
      if (newMessage.attachments.size > 0) {
        this.logger.debug(`Updating index entry for a message: ${oldMessage.id}, on ${formatGuildChannelIds(oldMessage.guildId, oldMessage.channelId)}`);
        await this.indexManager.updateEntry(oldMessage, newMessage);
      }
      else if (oldMessage.attachments.size > 0) {
        // If there's no attachments in new Message, but was in old then we need to remove entry, coz it's irrevelant to us now
        this.logger.debug(`Deleting index entry for a message: ${oldMessage.id}, on ${formatGuildChannelIds(oldMessage.guildId, oldMessage.channelId)}`);
        await this.indexManager.deleteEntry(oldMessage);
      }
    }
    catch (err) {
      this.logger.error(`Failed to update index entry for message: ${oldMessage.id}, on ${formatGuildChannelIds(oldMessage.guildId, oldMessage.channelId)}.
      \nIndex may be now invalid, running full index job is recommended
      \nError: ${inspect(err)}`);
    }
  }

  private async handleMessageDelete(message: Message) {
    try {
      this.logger.debug(`Deleting index entry for a message: ${message.id}, on ${formatGuildChannelIds(message.guildId, message.channelId)}`);
      await this.indexManager.deleteEntry(message);
    }
    catch (err) {
      this.logger.error(`Failed to delete index entry for message: ${message.id}, on ${formatGuildChannelIds(message.guildId, message.channelId)}.
      \nIndex may be now invalid, running full index job is recommended
      \nError: ${inspect(err)}`);
    }
  }
}
