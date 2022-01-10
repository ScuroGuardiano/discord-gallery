import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { IMediaElementDTO } from '@discord-gallery/api-interfaces';
import { ThumbnailService } from '../thumbnail/thumbnail.service';
import IThumbnailedMediaElement from '../thumnailed-media-element';

interface IRow {
  width: number;
  height: number;
  mediaElements: IThumbnailedMediaElement[];
}

function emptyRow(): IRow {
  return {
    width: 0,
    height: 0,
    mediaElements: []
  };
}

@Component({
  selector: 'dg-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {
  constructor(
    private elRef: ElementRef<HTMLDivElement>,
    private thumbnailService: ThumbnailService
  ) {}

  @Input()
  set mediaElements(v: IMediaElementDTO[]) {
    this._mediaElements = v;
    this.generateRows();
  }

  _mediaElements?: IMediaElementDTO[];
  rows: IRow[] = [];
  gap = 10;
  width = 0;
  minHeight = 250;
  maxHeight = 600;


  ngOnInit(): void {
    this.width = this.elRef.nativeElement.clientWidth;
  }

  @HostListener('window:resize')
  onResize() {
    this.width = this.elRef.nativeElement.clientWidth;
    this.generateRows();
  }

  get singleElementRowMode() {
    return this.width <= 700;
  }

  generateRows() {
    this.rows = [];
    if (this.singleElementRowMode) {
      this.rows = this._mediaElements?.map(me => {
        return {
          width: this.width,
          height: this.getHeightByWidth(me, this.width),
          mediaElements: [me]
        }
      }) ?? [];
      this.addThumbnailsToRows();
      return;
    }

    let currentRow: IRow = emptyRow();

    this._mediaElements?.forEach(mediaElement => {
      if (currentRow.mediaElements.length > 0) {
        const widthWithOneMoreElementUwU = currentRow.width + this.gap + this.getWidthByHeight(mediaElement, this.minHeight);
        console.log(widthWithOneMoreElementUwU);
        if (widthWithOneMoreElementUwU > this.width) {
          this.calculateRowHeightToFitWidthOfContainer(currentRow);
          this.rows.push(currentRow);
          currentRow = emptyRow();
        } else {
          currentRow.width += this.gap;
        }
      }

      currentRow.mediaElements.push(mediaElement);
      currentRow.width += this.getWidthByHeight(mediaElement, this.minHeight);
    });
    this.calculateRowHeightToFitWidthOfContainer(currentRow);
    this.rows.push(currentRow);
    this.addThumbnailsToRows();
    console.log(this.width);
  }

  private calculateRowHeightToFitWidthOfContainer(row: IRow) {
    const gapsWidth = (row.mediaElements.length - 1) * this.gap;
    const aspectRatio = this.minHeight / (row.width - gapsWidth);
    row.height = Math.round((this.width - gapsWidth) * aspectRatio);
    row.width = this.width;
    if (row.height > this.maxHeight) {
      row.height = this.maxHeight;
      row.width = row.height / aspectRatio + gapsWidth;
    }
  }

  private getWidthByHeight(image: IMediaElementDTO, height: number) {
    if (!image.width || !image.height) {
      return 0;
    }
    const aspectRatio = image.width / image.height;
    return Math.round(height * aspectRatio);
  }

  private getHeightByWidth(image: IMediaElementDTO, width: number) {
    if (!image.width || !image.height) {
      return 0;
    }
    const aspectRatio = image.width / image.height;
    return Math.round(width / aspectRatio);
  }

  private addThumbnailsToRows() {
    this.rows.forEach(row => {
      row.mediaElements.forEach(
        me => me.thumbnailUrl = this.thumbnailService.useIllegallyDiscordServersToResizeImageIntoThumbnail(
          me,
          this.getWidthByHeight(me, row.height),
          row.height
        )
      );
    });
  }
}
