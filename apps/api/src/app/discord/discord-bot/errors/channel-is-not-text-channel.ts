import { Channel, Guild } from "discord.js";

// eslint-disable-next-line
type FuckYouESLint = any;

export default class ChannelIsNotTextChannelError extends Error {
  constructor(guild: Guild, channel: Channel) {
    super(`Channel ${channel.id} (${(<FuckYouESLint>channel).name}) in guild ${guild.id} (${guild.name}) is not text channel`);
    this.name = ChannelIsNotTextChannelError.name;
  }
}
