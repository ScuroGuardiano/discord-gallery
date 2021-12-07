import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Link {

  /**
   * For better security like API Keys it will be hashed.
   */
  @PrimaryColumn()
  hashedLinkId: string;

  /**
   * Discord Server ID to which link belongs.
   */
  @Column()
  guildId: string;

  /**
   * Discord Chanell ID to which link belongs.
   */
  @Column()
  channelId: string;

  /**
   * I don't think generating perma access to Discord Server image history would be a good idea.
   *
   * So I include time limit. After date put in here link will be invalid and deleted from the database.
   */
  @Column()
  validBefore: Date;
}
