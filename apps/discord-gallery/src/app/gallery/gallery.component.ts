import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'discord-gallery-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  public path = '';

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.path = this.route.snapshot.paramMap.get('linkId') ?? '';
  }

}
