export default class JobAlreadyEnqueuedError extends Error {
  constructor(public guildId: string, public channelId: string) {
    super(`Job for guild: ${guildId} and channel: ${channelId} is already in queue!`);
    this.name = JobAlreadyEnqueuedError.name;
  }
}
