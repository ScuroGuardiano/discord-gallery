import { Guild } from "discord.js";

export default class NoAccessToChannelError extends Error {
  constructor(guild: Guild, channelId: string) {
    super(`Discord bot can't access channel ${channelId} in guild ${guild.id} (${guild.name})`);
    this.name = NoAccessToChannelError.name;
  }
}
