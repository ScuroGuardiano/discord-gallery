import { Component, Input } from '@angular/core';
import IThumbnailedMediaElement from '../thumnailed-media-element';

@Component({
  selector: 'dg-media-element',
  templateUrl: './media-element.component.html',
  styleUrls: ['./media-element.component.scss']
})
export class MediaElementComponent {
  @Input() public mediaElement?: IThumbnailedMediaElement;
}
