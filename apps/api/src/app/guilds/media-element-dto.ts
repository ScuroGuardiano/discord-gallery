import IndexEntry from "../index-manager/entities/index-entry.entity";

export default interface IMediaElementDTO {
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

export function indexEntryToMediaElementDTO(x: IndexEntry): IMediaElementDTO {
  return {
    messageId: x.messageId,
    createdAt: x.createdTimestamp,
    editedAt: x.editedTimestamp,
    content: x.content,
    name: x.attachmentName,
    url: x.attachmentURL,
    authorId: x.authorId,
    authorNickname: x.authorNickname,
    authorUsername: x.authorUsername
  }
}
