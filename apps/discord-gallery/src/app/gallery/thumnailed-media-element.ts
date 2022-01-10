import { IMediaElementDTO } from "@discord-gallery/api-interfaces";

export default interface IThumbnailedMediaElement extends IMediaElementDTO {
  thumbnailUrl?: string;
}
