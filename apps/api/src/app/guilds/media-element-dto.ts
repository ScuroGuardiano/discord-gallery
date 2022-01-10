import IndexEntry from "../index-manager/entities/index-entry.entity";
import { IMediaElementDTO } from "@discord-gallery/api-interfaces";

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
    authorUsername: x.authorUsername,
    width: x.imageWidth,
    height: x.imageHeight
  }
}
