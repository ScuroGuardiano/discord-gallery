import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import QueuedJob from './queued-job.entity';

@Entity()
export default class JobInProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  queuedJobId: number;

  @Column()
  scannedMessages: number;

  @Column({ nullable: true })
  lastMessageId: string;

  @Column()
  guildId: string;

  @Column()
  channelId: string;

  @Column({ nullable: true })
  startTime: Date;

  public start() {
    this.startTime = new Date();
  }

  public static create(guildId: string, channelId: string): JobInProgress {
    const job = new JobInProgress();
    job.guildId = guildId;
    job.channelId = channelId;
    job.scannedMessages = 0;
    return job;
  }

  public static fromQueuedJob(job: QueuedJob) {
    const newJob = new JobInProgress();
    newJob.guildId = job.guildId;
    newJob.channelId = job.channelId;
    newJob.scannedMessages = 0;
    newJob.queuedJobId = job.id;
    return newJob;
  }
}
