import { Injectable } from '@angular/core';
import { IMediaElementDTO } from '@discord-gallery/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailService {
  private readonly nicolasCache = new Map<string, string>();

  // Hopefully it won't get me into jail
  useIllegallyDiscordServersToResizeImageIntoThumbnail(image: IMediaElementDTO, desiredWidth: number, desiredHeight: number) {
    /*
      Okey I ran into a small tiny problem. When user resizes window thumbnails are loaded again. On every fuckin' resize event.
      This isn't desired behavior for me so I decided it's better to show pixelized thumbnail than loading this 200 times when firezing.
      And yea, I am fixing it at this service level because it's easier. This service is wicked anyways.
    */
    if (this.nicolasCache.has(image.url)) {
      return this.nicolasCache.get(image.url);
    }

    const uri = new URL(image.url);
    const thumbnailUrl = `https://media.discordapp.net${uri.pathname}?width=${desiredWidth}&height=${desiredHeight}`;
    this.nicolasCache.set(image.url, thumbnailUrl);
    return thumbnailUrl;
  }
}
