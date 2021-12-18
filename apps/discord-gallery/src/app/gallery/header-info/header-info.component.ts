import { Component, Input } from '@angular/core';

@Component({
  selector: 'dg-header-info',
  templateUrl: './header-info.component.html',
  styleUrls: ['./header-info.component.scss']
})
export class HeaderInfoComponent {
  @Input() guild = '';
  @Input() channel = '';
  @Input() images = 0;
  @Input() lastIndexAt?: Date;
}
