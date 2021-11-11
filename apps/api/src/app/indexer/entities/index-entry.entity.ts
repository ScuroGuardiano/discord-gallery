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
  attachmentURL: string;

  @Column()
  authorId: string;

  /**
   * Name on guild
   */
  @Column()
  authorNickname: string;

  /**
   * Name on Discord
   */
  @Column()
  authorUsername: string;
}
