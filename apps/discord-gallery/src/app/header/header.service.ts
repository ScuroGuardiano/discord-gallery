import { EventEmitter, Injectable, Type } from '@angular/core';
import IHeaderEmbed from './header-embed';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  public get headerEmbed() {
    return this._headerEmbed;
  }

  public embedChanged = new EventEmitter<IHeaderEmbed<any> | undefined>();

  private _headerEmbed?: IHeaderEmbed<any>;

  public setHeaderEmbed<T>(component: Type<T>, data: Partial<T>) {
    this._headerEmbed = { component, data };
    this.embedChanged.emit(this._headerEmbed);
  }
}
