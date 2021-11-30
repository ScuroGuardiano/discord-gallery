export default class RescanOnCooldownError extends Error {
  constructor(public guildId: string, public channelId: string) {
    super(`Job for guild: ${guildId} and channel: ${channelId} was finished before rescan cooldown has passed.`);
    this.name = RescanOnCooldownError.name;
  }
}
