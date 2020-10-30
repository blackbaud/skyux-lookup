import {
  fakeAsync,
  ComponentFixture,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  Component
} from '@angular/core';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyCountryFieldTestingModule
} from './country-field-testing.module';

import {
  SkyCountryFieldFixture
} from './country-field-fixture';

const DATA_SKY_ID = 'test-country-field';
const COUNTRY_NAME = 'United States';

//#region Test component
@Component({
  selector: 'country-field-test',
  template: `
  <sky-country-field
    data-sky-id="${DATA_SKY_ID}"
    formControlName="countryControl"
    [autocompleteAttribute]="autocompleteAttribute"
    [disabled]="disabled"
    [hideSelectedCountryFlag]="hideSelectedCountryFlag"
    (selectedCountryChange)="selectedCountryChange($event)"
  >
  </sky-country-field>
  `
})
class CountryFieldTestComponent {
  public autocompleteAttribute: string;
  public disabled: boolean;
  public hideSelectedCountryFlag: boolean;

  public selectedCountryChange(query: string) { }
}
//#endregion Test component

describe('Country field fixture', () => {
  let fixture: ComponentFixture<CountryFieldTestComponent>;
  let testComponent: CountryFieldTestComponent;
  let countryFieldFixture: SkyCountryFieldFixture;

  //#region helpers

  function detectChangesFakeAsync(): void {
    fixture.detectChanges();
    tick();
  }

  //#endregion

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CountryFieldTestComponent
      ],
      imports: [
        SkyCountryFieldTestingModule
      ]
    });

    fixture = TestBed.createComponent(
      CountryFieldTestComponent
    );
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    countryFieldFixture = new SkyCountryFieldFixture(fixture, DATA_SKY_ID);
  });

  it('should expose the expected defaults', fakeAsync(async () => {
    // verify default values
    expect(countryFieldFixture.autocomplete).toBe('off');
    expect(countryFieldFixture.isDisabled).toBe(false);
  }));

  it('should expose the expected properties', fakeAsync(async () => {
    // modify to non-default values
    testComponent.autocompleteAttribute = 'on';
    testComponent.disabled = true;
    fixture.detectChanges();

    // verify updated values
    expect(countryFieldFixture.autocomplete).toBe(testComponent.autocompleteAttribute);
    expect(countryFieldFixture.isDisabled).toBe(testComponent.disabled);
  }));

  it('should show country flag by default', fakeAsync(async () => {

    // make a selection so the flag appears
    await countryFieldFixture.select(COUNTRY_NAME);
    detectChangesFakeAsync();

    // verify country flag state
    expect(countryFieldFixture.countryFlagIsVisible).toBe(true);
  }));

  it('should hide country flag when requested', fakeAsync(async () => {
    // modify to non-default values
    testComponent.hideSelectedCountryFlag = true;
    fixture.detectChanges();

    // make a selection
    await countryFieldFixture.select(COUNTRY_NAME);
    detectChangesFakeAsync();

    // verify country flag state
    expect(countryFieldFixture.countryFlagIsVisible).toBe(false);
  }));

  it('should be able to clear when there is no selection', fakeAsync(async () => {
    // verify there is no selection
    expect(countryFieldFixture.searchText).toBe('');

    // clear should work when there's no selection
    await countryFieldFixture.clear();

    // verify the selection is cleared
    expect(countryFieldFixture.searchText).toBe('');
  }));

  it('should be able to clear when there is no selection', fakeAsync(async () => {
    // make a selection
    await countryFieldFixture.select(COUNTRY_NAME);
    expect(countryFieldFixture.searchText).toBe(COUNTRY_NAME);

    // clear the selection
    await countryFieldFixture.clear();

    // verify the selection is cleared
    expect(countryFieldFixture.searchText).toBe('');
  }));

  it('should be able to clear when results are showing', fakeAsync(async () => {
    // perform a search, displaying results
    await countryFieldFixture.search(COUNTRY_NAME);
    expect(countryFieldFixture.searchText).toBe(COUNTRY_NAME);

    // clear the selection
    await countryFieldFixture.clear();

    // verify the selection is cleared
    expect(countryFieldFixture.searchText).toBe('');
  }));

  it('should expose expected search results', fakeAsync(async () => {
    // perform a search, displaying results
    const results = await countryFieldFixture.search(COUNTRY_NAME);

    // verify there are results
    expect(results.length).toBeGreaterThan(0);

    // verify the top result is as expected
    const topResult = results[0];
    const countryNameEl = topResult.querySelector('.sky-highlight-mark');
    const countryName = SkyAppTestUtility.getText(countryNameEl);
    expect(countryName).toEqual(COUNTRY_NAME);
  }));
});
