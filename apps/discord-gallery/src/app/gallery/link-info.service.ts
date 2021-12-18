import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGuildLinkInfo } from '@discord-gallery/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class LinkInfoService {
  constructor(private http: HttpClient) {}

  public getLinkInfo(linkId: string) {
    return this.http.get<IGuildLinkInfo>(`/api/guilds/${linkId}`).pipe(

    )
  }
}
