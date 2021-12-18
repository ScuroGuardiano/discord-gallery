import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGuildLinkInfo } from '@discord-gallery/api-interfaces';
import { LinkInfoService } from './link-info.service';

@Component({
  selector: 'discord-gallery-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  public path = '';
  public link?: IGuildLinkInfo;
  public error?: string;

  constructor(
    private route: ActivatedRoute,
    private linkInfo: LinkInfoService
  ) { }

  ngOnInit(): void {
    this.path = this.route.snapshot.paramMap.get('linkId') ?? '';
    this.linkInfo.getLinkInfo(this.path)
      .subscribe(
        link => this.link = link,
        error => this.error = error
      );
  }

  public get loading() {
    return !this.link && !this.error;
  }

}
