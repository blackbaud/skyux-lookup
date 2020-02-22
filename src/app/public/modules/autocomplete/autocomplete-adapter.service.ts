import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  fromEvent as observableFromEvent
} from 'rxjs';

@Injectable()
export class SkyAutocompleteAdapterService {
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private windowRef: SkyAppWindowRef
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public watchDropdownWidth(elementRef: ElementRef): void {
    observableFromEvent(this.windowRef.nativeWindow, 'resize')
      .subscribe(() => {
        this.setDropdownWidth(elementRef);
      });

    this.windowRef.nativeWindow.setTimeout(() => {
      this.setDropdownWidth(elementRef);
    });
  }

  public setDropdownWidth(elementRef: ElementRef): void {
    const dropdownContainer = elementRef.nativeElement.querySelector('.sky-popover-container');
    const width = elementRef.nativeElement.getBoundingClientRect().width;
    this.renderer.setStyle(dropdownContainer, 'width', `${width}px`);
  }
}
