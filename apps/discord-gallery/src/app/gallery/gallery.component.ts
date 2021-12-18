import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGuildLinkInfo } from '@discord-gallery/api-interfaces';
import IHeaderEmbed from '../header/header-embed';
import { HeaderService } from '../header/header.service';
import { HeaderInfoComponent } from './header-info/header-info.component';
import { LinkInfoService } from './link-info.service';

@Component({
  selector: 'dg-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  public path = '';
  public link?: IGuildLinkInfo;
  public error?: string;

  constructor(
    private route: ActivatedRoute,
    private linkInfo: LinkInfoService,
    private headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.path = this.route.snapshot.paramMap.get('linkId') ?? '';
    this.linkInfo.getLinkInfo(this.path)
      .subscribe(
        link => {
          this.link = link;
          this.headerService.setHeaderEmbed(
            HeaderInfoComponent,
            {
              guild: link.guildName,
              channel: link.channelName,
              images: link.mediaAssetsCount,
              lastIndexAt: link.lastIndexedAt
            }
          )
        },
        error => this.error = error
      );
  }

  public get loading() {
    return !this.link && !this.error;
  }

}
