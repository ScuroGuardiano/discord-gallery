export default interface IGuildLinkInfo {
  guildId: string,
  channelId: string,
  guildName: string,
  channelName: string,
  lastIndexedAt?: Date,
  mediaAssetsCount: number
}
