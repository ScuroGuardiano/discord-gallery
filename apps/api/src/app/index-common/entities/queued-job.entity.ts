import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class QueuedJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  guildId: string;

  @Column()
  channelId: string;

  @Column()
  queuedAt: Date;

  public static create(guildId: string, channelId: string): QueuedJob {
    const job = new QueuedJob();
    job.guildId = guildId;
    job.channelId = channelId;
    return job;
  }

  @BeforeInsert()
  enqueue() {
    this.queuedAt = new Date();
  }
}
