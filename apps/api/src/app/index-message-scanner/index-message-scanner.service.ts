import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'typeorm';
import { DiscordService } from '../discord/discord.service';
import { IndexManagerService } from '../index-manager/index-manager.service';
import JobInProgress from '../index-common/entities/job-in-progress.entity';
import { Message } from 'discord.js';

@Injectable()
export class IndexMessageScannerService {
  constructor(
    private discordService: DiscordService,
    private connection: Connection,
    private indexManager: IndexManagerService
  ) {}

  public async scan(job: JobInProgress) {
    const logger = new Logger(`IndexMessageScannerService:${job.guildId}:${job.channelId}`);

    if (!job.startTime) {
      logger.log(`Starting scanning job...`);
      job.start();
      await this.connection.manager.save(job);
    }
    else {
      logger.log(`Resuming scanning job started at: ${job.startTime.toLocaleString()}, already scanned: ${job.scannedMessages}.`);
    }

    for (;;) {
      const messages = await this.getMessages(job);

      if (messages.length === 0) {
        break;
      }

      const lastMessage = messages[messages.length - 1];
      const messagesWithAttachments = this.filterOnlyWithAttachments(messages);

      await this.indexManager.indexMessages(messagesWithAttachments);
      job.scannedMessages += messages.length;
      job.lastMessageId = lastMessage.id;
      await this.connection.manager.save(job);

      logger.debug(`Scanned ${job.scannedMessages} messages, in this iteration indexed ${messagesWithAttachments.length} messages.`);
    }

    logger.log("Scan finished.");
  }

  private async getMessages(job: JobInProgress) {
    return this.discordService.getMessages(
      job.guildId,
      job.channelId,
      100,
      job.lastMessageId
    );
  }

  private filterOnlyWithAttachments(messages: Message[]) {
    return messages.filter(message => {
      return message.attachments.size > 0;
    });
  }
}
