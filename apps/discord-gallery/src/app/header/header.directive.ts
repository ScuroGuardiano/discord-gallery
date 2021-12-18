import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Directive used to dynamically inject components into
 * main header of this app.
 *
 * From Angular tutoriel: https://angular.io/guide/dynamic-component-loader
 */
@Directive({
  selector: '[dgHeaderEmbed]'
})
export class HeaderEmbedDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
