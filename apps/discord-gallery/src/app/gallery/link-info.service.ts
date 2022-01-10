import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGalleryQuery, IGuildLinkInfo, IMediaElementDTO } from '@discord-gallery/api-interfaces';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LinkInfoService {
  constructor(private http: HttpClient) {}

  public getLinkInfo(linkId: string) {
    return this.http.get<IGuildLinkInfo>(`/api/guilds/${linkId}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  public getImagesFromLink(linkId: string, { limit = 12, offset = 0 }: IGalleryQuery) {
    return this.http.get<IMediaElementDTO[]>(
      `/api/guilds/${linkId}/gallery?offset=${offset}&limit=${limit}`
    ).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error(`Can't connect to backend, error:`, error.error);
      return throwError('Cannot connect to backend. Check your network.');
    }
    else {
      console.error(`Backend returned ${error.status} error code, body: ${error.error}`);
    }

    if (error.status === 404) {
      return throwError('Link was not found.');
    }

    if (error.status === 400 && error.error?.errorType === 'LinkExpiredError') {
      return throwError('Link expired, create a new one.');
    }

    if (error.status === 400) {
      return throwError('Link is invalid.');
    }

    if (error.status >= 500 && error.status < 600) {
      return throwError(`Server error: ${error.statusText}.`);
    }

    return throwError('Uknown error occured.');
  }
}
