import {
  ComponentFixture,
  tick
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyCountryFieldCountry
} from '@skyux/lookup';

/**
 * Allows interaction with a SKY UX country field component.
 */
export class SkyCountryFieldFixture {
  private debugEl: DebugElement;
  private countries: SkyCountryFieldCountry[];

  constructor(
    private fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(fixture, skyTestId, 'sky-country-field');

    this.countries = JSON.parse(
      JSON.stringify((window as any)
        .intlTelInputGlobals
        .getCountryData()
      )
    );
  }

  /**
   * The value of the input field's autocomplete attribute.
   */
  public get autocomplete(): string {
    const inputEl = this.getInput();
    return inputEl.nativeElement.autocomplete;
  }

  /**
   * A flag indicating if the country flag is currently visible.
   * The flag will be visible only if a selection has been made
   * and if the hideSelectedCountryFlag option is false.
   */
  public get countryFlagIsVisible(): boolean {
    const flag = this.getCountryFlag();
    return flag !== null;
  }

  /**
   * A flag indicating whether or not the input has been disabled.
   */
  public get isDisabled(): boolean {
    const inputEl = this.getInput();
    return inputEl.nativeElement.disabled;
  }

  /**
   * The value of the input field.
   */
  public get searchText(): string {
    const inputEl = this.getInput();
    return inputEl.nativeElement.value;
  }

  /**
   * The value of the input field.
   */
  public get selectedCountryData(): SkyCountryFieldCountry {
    return this.countries.find((x: any) => x.name === this.searchText);
  }

  /**
   * Enters the search text into the input field displaying search results, but making no selection.
   * @param searchText The name of the country to select.
   */
  public async search(searchText: string): Promise<NodeListOf<HTMLElement>> {
    return this.searchAndGetResults(searchText, this.fixture);
  }

  /**
   * Enters the search text into the input field and selects the first result (if any).
   * @param searchText The name of the country to select.
   */
  public async select(searchText: string): Promise<any> {
    this.searchAndSelect(searchText, 0, this.fixture);

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  /**
   * Clears the country selection and input field.
   */
  public clear(): Promise<any> {
    this.enterSearch('', this.fixture);

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  //#region helpers

  private getCountryFlag(): DebugElement {
    return this.debugEl.query(By.css('.sky-country-field-flag'));
  }

  private getInput(): DebugElement {
    return this.debugEl.query(By.css('textarea'));
  }

  private getAutocompleteElement(): HTMLElement {
    return document.querySelector('.sky-autocomplete-results') as HTMLElement;
  }

  private getInputElement(): HTMLTextAreaElement {
    return this.getInput().nativeElement as HTMLTextAreaElement;
  }

  private blurInput(fixture: ComponentFixture<any>): void {
    SkyAppTestUtility.fireDomEvent(this.getInputElement(), 'blur');
    fixture.detectChanges();
    tick();
  }

  private enterSearch(newValue: string, fixture: ComponentFixture<any>): void {
    const inputElement = this.getInputElement();
    inputElement.value = newValue;

    SkyAppTestUtility.fireDomEvent(inputElement, 'keyup');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  private searchAndGetResults(newValue: string, fixture: ComponentFixture<any>): NodeListOf<HTMLElement> {
    this.enterSearch(newValue, fixture);
    return this.getAutocompleteElement().querySelectorAll('.sky-autocomplete-result');
  }

  private searchAndSelect(newValue: string, index: number, fixture: ComponentFixture<any>): void {
    const inputElement = this.getInputElement();
    const searchResults = this.searchAndGetResults(newValue, fixture);

    if (searchResults.length < (index + 1)) {
      throw new Error('Index out of range for results');
    }

    // Note: the ordering of these events is important!
    SkyAppTestUtility.fireDomEvent(inputElement, 'change');
    SkyAppTestUtility.fireDomEvent(searchResults[index], 'mousedown');
    this.blurInput(fixture);
  }

  //#endregion helpers
}
