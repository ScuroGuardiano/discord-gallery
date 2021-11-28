import { Injectable } from '@nestjs/common';
import { Message, TextChannel } from 'discord.js';
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
    const indexEntries = messages.map(message => {
      const indexEntry = new IndexEntry();
      indexEntry.messageId = message.id;
      indexEntry.guildId = message.guildId;
      indexEntry.guildName = message.guild.name;
      indexEntry.channelId = message.channelId;
      indexEntry.channelName = (<TextChannel>message.channel).name;
      indexEntry.authorId = message.author.id;
      indexEntry.authorNickname = (message.member?.nickname) ?? "FUCK YOU";
      indexEntry.authorUsername = message.author.tag;
      indexEntry.content = message.content;
      indexEntry.createdTimestamp = message.createdAt;
      indexEntry.editedTimestamp = message.editedAt;
      indexEntry.attachmentURL = message.attachments.first().url;
      indexEntry.attachmentName = message.attachments.first().name;
      return indexEntry;
    });

    await this.connection.manager.save(indexEntries);
  }
}
