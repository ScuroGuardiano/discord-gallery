import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { GalleryComponent } from './gallery/gallery.component';
import { HeaderInfoComponent } from './gallery/header-info/header-info.component';
import { HeaderComponent } from './header/header.component';
import { HeaderEmbedDirective } from './header/header.directive';

@NgModule({
  declarations: [AppComponent, GalleryComponent, HeaderInfoComponent, HeaderComponent, HeaderEmbedDirective],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
