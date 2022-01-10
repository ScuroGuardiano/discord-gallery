import { Message, TextChannel } from "discord.js";
import { Column, Entity, PrimaryColumn } from "typeorm";

// TODO: Make you homework and learn how indices work.
// I must set simple values that will help to track me messages per guild
// So propably it will be index on 2 fiels, GuildID and message timestamp I guess
// TODO: Normalize it... maybe

@Entity()
export default class IndexEntry {
  @PrimaryColumn()
  messageId: string;

  @Column()
  guildId: string;

  /**
   * Column only for informational purpouses.
   */
  @Column()
  guildName: string;

  @Column()
  channelId: string;

  /**
   * Column only for information purpouses.
   */
  @Column()
  channelName: string;

  @Column()
  createdTimestamp: Date;

  @Column({ nullable: true })
  editedTimestamp: Date;

  @Column({ nullable: true })
  deletedTimestamp: Date;

  @Column({ default: false })
  deleted: boolean;

  @Column()
  content: string;

  @Column()
  attachmentName: string;

  @Column()
  attachmentURL: string;

  @Column({ nullable: true })
  imageWidth?: number;

  @Column({ nullable: true })
  imageHeight?: number;

  @Column()
  authorId: string;

  /**
   * Name on guild
   */
  @Column({ nullable: true })
  authorNickname?: string;

  /**
   * Name on Discord
   */
  @Column()
  authorUsername: string;

  public static fromMessage(message: Message): IndexEntry {
    const indexEntry = new IndexEntry();
    indexEntry.messageId = message.id;
    indexEntry.guildId = message.guildId;
    indexEntry.guildName = message.guild.name;
    indexEntry.channelId = message.channelId;
    indexEntry.channelName = (<TextChannel>message.channel).name;
    indexEntry.authorId = message.author.id;
    indexEntry.authorNickname = message.member?.nickname;
    indexEntry.authorUsername = message.author.tag;
    indexEntry.content = message.content;
    indexEntry.createdTimestamp = message.createdAt;
    indexEntry.editedTimestamp = message.editedAt;
    indexEntry.attachmentURL = message.attachments.first().url;
    indexEntry.attachmentName = message.attachments.first().name;
    indexEntry.imageWidth = message.attachments.first().width ?? null;
    indexEntry.imageHeight = message.attachments.first().height ?? null;
    return indexEntry;
  }
}
