import { Component, Input } from '@angular/core';
import { IMediaElementDTO } from '@discord-gallery/api-interfaces';

@Component({
  selector: 'dg-media-row',
  templateUrl: './media-row.component.html',
  styleUrls: ['./media-row.component.scss']
})
export class MediaRowComponent {
  @Input() mediaElements?: IMediaElementDTO[];
  @Input() height?: number;
  @Input() gap = 10;

  get rowStyle(): string {
    if (this.height === 0) {
      return `height:auto;gap:${this.gap}px;`
    }
    return `height:${this.height}px;gap:${this.gap}px;`
  }
}
