export enum JOB_STATUSES {
  NOT_FOUND = "NOT_FOUND",
  QUEUED = "QUEUED",
  RUNNING = "RUNNING",
  FINISHED = "FINISHED"
}

export interface IJobStatus {
  status: JOB_STATUSES;
  scannedMessages?: number;
  positionInQueue?: number;
}
