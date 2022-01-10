import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { GalleryComponent } from './gallery/gallery.component';
import { HeaderInfoComponent } from './gallery/header-info/header-info.component';
import { HeaderComponent } from './header/header.component';
import { HeaderEmbedDirective } from './header/header.directive';
import { MediaElementComponent } from './gallery/media-element/media-element.component';
import { MediaRowComponent } from './gallery/media-row/media-row.component';
import { MediaListComponent } from './gallery/media-list/media-list.component';

@NgModule({
  declarations: [AppComponent, GalleryComponent, HeaderInfoComponent, HeaderComponent, HeaderEmbedDirective, MediaElementComponent, MediaRowComponent, MediaListComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
