import { Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import IHeaderEmbed from "./header-embed";
import { HeaderEmbedDirective } from "./header.directive";
import { HeaderService } from "./header.service";

@Component({
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  selector: 'dg-header'
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private headerService: HeaderService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  @ViewChild(HeaderEmbedDirective, { static: true }) headerEmbed!: HeaderEmbedDirective;
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this
      .headerService
      .embedChanged
      .subscribe(this.handleEmbedChange.bind(this));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private handleEmbedChange(embed: IHeaderEmbed<any>) {
    const viewRef = this.headerEmbed.viewContainerRef;
    viewRef.clear();
    if (!embed) {
      return;
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(embed.component);
    const componentRef = viewRef.createComponent<any>(componentFactory);
    this.copyDataToComponent(componentRef, embed.data);
  }

  private copyDataToComponent<T>(componentRef: ComponentRef<T>, data: T) {
    for (const [key, value] of Object.entries(data)) {
      (componentRef as any).instance[key] = value;
    }
  }
}
