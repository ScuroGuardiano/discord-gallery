export default class JobAlreadyRunningError extends Error {
  constructor(public guildId: string, public channelId: string) {
    super(`Job for guild: ${guildId} and channel: ${channelId} is already in running!`);
    this.name = JobAlreadyRunningError.name;
  }
}
