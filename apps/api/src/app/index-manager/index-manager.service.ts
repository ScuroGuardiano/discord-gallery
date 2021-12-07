import { Injectable } from '@nestjs/common';
import { Message } from 'discord.js';
import { Connection } from 'typeorm';
import IndexEntry from './entities/index-entry.entity';

@Injectable()
export class IndexManagerService {
  constructor(
    private connection: Connection
  ) {}

  public async indexMessages(messages: Message[]) {
    if (messages.length === 0) {
      return;
    }
    const indexEntries = messages.map(message => IndexEntry.fromMessage(message));

    await this.connection.manager.save(indexEntries);
  }

  public async countIndexEntries(guildId: string, channelId: string): Promise<number> {
    return this.connection.manager.count(IndexEntry, {
      where: {
        guildId, channelId
      }
    });
  }

  public async fetchEntries(guildId: string, channelId: string, limit: number, offset = 0): Promise<IndexEntry[]> {
    return this.connection.manager.find(IndexEntry, {
      where: { guildId, channelId, deleted: false },
      order: { createdTimestamp: 'DESC' },
      take: limit,
      skip: offset
    });
  }

  public async indexMessage(message: Message) {
    const indexEntry = IndexEntry.fromMessage(message);
    await this.connection.manager.save(indexEntry);
  }

  public async deleteEntry(message: Message) {
    await this.connection.manager.delete(IndexEntry, {
      messageId: message.id
    });
  }

  public async updateEntry(oldMessage: Message, newMessage: Message) {
    const indexEntry = IndexEntry.fromMessage(newMessage);
    indexEntry.messageId = oldMessage.id; // For sanity
    await this.connection.manager.save(indexEntry);
  }

  public async wipeIndexForGuildIdChannelId(guildId: string, channelId: string) {
    await this.connection.manager.delete(IndexEntry, {
      guildId, channelId
    });
  }
}
