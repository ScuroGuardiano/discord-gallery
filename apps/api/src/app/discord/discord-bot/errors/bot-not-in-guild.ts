export default class BotNotInGuildError extends Error {
  constructor(guildId: string) {
    super(`Discord bot is not in guild ${guildId}.`);
    this.name = BotNotInGuildError.name;
  }
}
