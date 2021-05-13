import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyCoreAdapterService,
  SkyOverlayInstance
} from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyAutocompleteAdapterService {
  private renderer: Renderer2;

  constructor(
    private coreAdapterService: SkyCoreAdapterService,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public getActiveElement(): Element {
    return document.activeElement;
  }

  public getBodyFocusable(): HTMLElement[] {
    return this.coreAdapterService.getFocusableChildren(document.body);
  }

  public getOverlayFocusableElements(overlay: SkyOverlayInstance): HTMLElement[] {
    return this.coreAdapterService.getFocusableChildren(
      overlay?.componentRef.location.nativeElement,
      { ignoreTabIndex: true }
    );
  }

  public overlayContainsActiveElement(overlay: SkyOverlayInstance): boolean {
    return overlay.componentRef.location.nativeElement.contains(this.getActiveElement());
  }

  public addCSSClass(element: HTMLElement, className: string): void {
    if (element) {
      this.renderer.addClass(element, className);
    }
  }

  public removeCSSClass(element: HTMLElement, className: string): void {
    if (element) {
      this.renderer.removeClass(element, className);
    }
  }

  /**
   * Sets the `tabIndex` of the `element` to the provided `tabIndex`.
   */
  public setTabIndex(element: HTMLElement, tabIndex: number): void {
    element.tabIndex = tabIndex;
  }

  public setDropdownWidth(elementRef: ElementRef, dropdownRef: ElementRef): void {
    const width = elementRef.nativeElement.getBoundingClientRect().width;
    this.renderer.setStyle(dropdownRef.nativeElement, 'width', `${width}px`);
  }

  public sendEvent(elementRef: HTMLElement, eventName: string): void {
    const event = new Event(eventName);
    elementRef.dispatchEvent(event);
  }
}
