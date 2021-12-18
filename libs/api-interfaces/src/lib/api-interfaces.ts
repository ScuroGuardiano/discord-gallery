export interface IGuildLinkInfo {
  guildId: string,
  channelId: string,
  guildName: string,
  channelName: string,
  lastIndexedAt?: Date,
  mediaAssetsCount: number
}

export interface IGalleryQuery {
  offset?: number;
  limit?: number;
}

export interface IMediaElementDTO {
  messageId: string;
  createdAt: Date;
  editedAt?: Date;
  content: string;
  name: string;
  url: string;
  authorId: string;
  authorNickname?: string;
  authorUsername: string;
}
