import { Column, Entity } from "typeorm";
import JobInProgress from "./job-in-progress.entity";

@Entity()
export default class FinishedJob extends JobInProgress {
  @Column()
  finishTime: Date;

  @Column({ nullable: true, type: "text" })
  errorDetails: string;

  public static fromJobInProgress(jobInProgress: JobInProgress) {
    const job = new FinishedJob();
    job.id = jobInProgress.id;
    job.guildId = jobInProgress.guildId;
    job.channelId = jobInProgress.channelId;
    job.lastMessageId = jobInProgress.lastMessageId;
    job.scannedMessages = jobInProgress.scannedMessages;
    job.startTime = jobInProgress.startTime;
    job.queuedJobId = jobInProgress.queuedJobId;
    return job;
  }

  public finish(err?: string) {
    this.finishTime = new Date();
    if (err) {
      this.errorDetails = err;
    }
  }
}
