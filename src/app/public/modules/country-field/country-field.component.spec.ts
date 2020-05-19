import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  expect, SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyCountryFieldModule
} from './country-field.module';

import {
  CountryFieldTestComponent
} from './fixtures/country-field.component.fixture';

import {
  CountryFieldNoFormTestComponent
} from './fixtures/country-field-no-form.component.fixture';

import {
  CountryFieldReactiveTestComponent
} from './fixtures/country-field-reactive.component.fixture';

describe('Country Field Component', () => {

  //#region helpers

  function blurInput(fixture: ComponentFixture<any>): void {
    SkyAppTestUtility.fireDomEvent(getInputElement(), 'blur');
    fixture.detectChanges();
    tick();
  }

  function enterSearch(newValue: string, fixture: ComponentFixture<any>): void {
    const inputElement = getInputElement();
    inputElement.value = newValue;

    SkyAppTestUtility.fireDomEvent(inputElement, 'keyup');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function getAutocompleteElement(): HTMLElement {
    return document.querySelector('.sky-autocomplete-results') as HTMLElement;
  }

  function getInputElement(): HTMLTextAreaElement {
    return document.querySelector('textarea') as HTMLTextAreaElement;
  }

  function searchAndSelect(newValue: string, index: number, fixture: ComponentFixture<any>): void {
    const inputElement = getInputElement();

    enterSearch(newValue, fixture);
    const searchResults = getAutocompleteElement().querySelectorAll('.sky-autocomplete-result');

    // Note: the ordering of these events is important!
    SkyAppTestUtility.fireDomEvent(inputElement, 'change');
    SkyAppTestUtility.fireDomEvent(searchResults[index], 'mousedown');
    blurInput(fixture);
  }

  function searchAndGetResults(newValue: string, fixture: ComponentFixture<any>): NodeListOf<HTMLElement> {
    enterSearch(newValue, fixture);
    return getAutocompleteElement().querySelectorAll('.sky-autocomplete-result');
  }

  //#endregion

  describe('template form', () => {

    let fixture: ComponentFixture<CountryFieldTestComponent>;
    let component: CountryFieldTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          CountryFieldTestComponent
        ],
        imports: [
          FormsModule,
          SkyCountryFieldModule
        ]
      });

      fixture = TestBed.createComponent(CountryFieldTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    describe('initialization', () => {

      it('should initialize with a set country', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('us');
      }));

      it('should initialize with a set country but only the iso2 code', fakeAsync(() => {
        component.modelValue = {
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('us');
      }));

      it('should initialize with a set country and fix an invalid name', fakeAsync(() => {
        component.modelValue = {
          iso2: 'us',
          name: 'Test Name'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('us');
      }));

      it('should initialize without a set country', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
      }));

    });

    describe('usage', () => {

      it('should change countries correctly', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('Australia');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('au');
      }));

      it('should change countries correctly via a model change', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');

        component.modelValue = {
          name: 'Australia',
          iso2: 'au'
        };

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('Australia');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('au');
      }));

      it('should change countries correctly via a model change with an invalid name', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');

        component.modelValue = {
          name: 'Test Name',
          iso2: 'au'
        };

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('Australia');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('au');
      }));

      it('should change countries correctly via a model change with only a iso2 code', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');

        component.modelValue = {
          name: 'Australia',
          iso2: 'au'
        };

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('Australia');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('au');
      }));

      it('should display the default country first in the result list with not selection', fakeAsync(() => {
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('Cyprus (Κύπρος)');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('cy');
      }));

      it('should only display supported countries', fakeAsync(() => {
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['au', 'us'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('United States');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('us');

        expect(results[1].innerText.trim()).toBe('Australia');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('au');

        expect(results.length).toBe(2);
      }));

      it('should display the default country second in the result list with a selection', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('United States');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('us');
        expect(results[1].innerText.trim()).toBe('Cyprus (Κύπρος)');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('cy');
      }));

      it('should clear the selection when all search text is cleared', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('', fixture);
        blurInput(fixture);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.modelValue).toBeUndefined();
        expect(nativeElement.querySelector('textarea').value).toBe('');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
      }));

      it('should disable the field correctly', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        component.isDisabled = true;
        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement = nativeElement.querySelector('textarea');

        expect(textAreaElement
          .attributes.getNamedItem('disabled')).not.toBeNull();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'mousedown');
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusin');
        fixture.detectChanges();
        tick();

        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
      }));

      it('should enable the field correctly', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        component.isDisabled = true;
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement = nativeElement.querySelector('textarea');

        expect((<HTMLElement>nativeElement.querySelector('textarea'))
          .attributes.getNamedItem('disabled')).not.toBeNull();
        component.isDisabled = false;
        fixture.detectChanges();
        tick();

        SkyAppTestUtility.fireDomEvent(textAreaElement, 'mousedown');
        fixture.detectChanges();
        tick();

        expect((<HTMLElement>nativeElement.querySelector('textarea'))
          .attributes.getNamedItem('disabled')).toBeNull();
        expect(component.countryFieldComponent.isInputFocused).toBeTruthy();

        component.countryFieldComponent.isInputFocused = false;
        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusin');
        fixture.detectChanges();

        expect(component.countryFieldComponent.isInputFocused).toBeTruthy();
      }));

      it('should emit the countryChange event correctly', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'countryChanged').and.callThrough();
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });
      }));

    });

    describe('validation', () => {

      it('should mark the form invalid when it is empty and required', fakeAsync(() => {
        fixture.detectChanges();
        component.isRequired = true;
        fixture.detectChanges();
        tick();
        component.ngModel.control.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.ngModel.valid).toEqual(false);
      }));

      it('should mark the form valid when it is set and required', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        component.isRequired = true;
        fixture.detectChanges();
        tick();
        component.ngModel.control.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.ngModel.valid).toEqual(true);
      }));

      it('should mark the form invalid when it is set to a non-real country', fakeAsync(() => {
        component.modelValue = {
          name: 'Test Country',
          iso2: 'xx'
        };
        fixture.detectChanges();
        component.ngModel.control.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.ngModel.valid).toEqual(false);
      }));

      it('should mark the form valid when it is set to a real country', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        component.ngModel.control.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.ngModel.valid).toEqual(true);
      }));

      it('should mark the form valid when it is set to a supported country', fakeAsync(() => {
        component.modelValue = {
          name: 'Australia',
          iso2: 'au'
        };
        component.supportedCountryISOs = ['au', 'de'];
        fixture.detectChanges();
        component.ngModel.control.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.ngModel.valid).toEqual(true);
      }));

      it('should mark the form invalid when it is set to a non-supported country', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        component.supportedCountryISOs = ['au', 'de'];
        fixture.detectChanges();
        component.ngModel.control.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.ngModel.valid).toEqual(false);
      }));

    });

    describe('a11y', () => {

      it('should be accessible (empty)', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(document.body).toBeAccessible();
        });
      }));

      it('should be accessible (populated)', async(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(document.body).toBeAccessible();
        });
      }));

    });

  });

  describe('reactive form', () => {

    let fixture: ComponentFixture<CountryFieldReactiveTestComponent>;
    let component: CountryFieldReactiveTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          CountryFieldReactiveTestComponent
        ],
        imports: [
          ReactiveFormsModule,
          SkyCountryFieldModule
        ]
      });

      fixture = TestBed.createComponent(CountryFieldReactiveTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    describe('initialization', () => {

      it('should initialize with a set country', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('us');
      }));

      it('should initialize with a set country but only the iso2 code', fakeAsync(() => {
        component.initialValue = {
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('us');
      }));

      it('should initialize with a set country and fix an invalid name', fakeAsync(() => {
        component.initialValue = {
          iso2: 'us',
          name: 'Test Name'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('us');
      }));

      it('should initialize without a set country', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
      }));

    });

    describe('usage', () => {

      it('should change countries correctly', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('Australia');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('au');
      }));

      it('should change countries correctly via a model change', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');

        component.countryControl.setValue({
          name: 'Australia',
          iso2: 'au'
        });

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('Australia');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('au');
      }));

      it('should change countries correctly via a model change with an invalid name', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');

        component.countryControl.setValue({
          name: 'Test Name',
          iso2: 'au'
        });

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('Australia');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('au');
      }));

      it('should change countries correctly via a model change with only a iso2 code', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');

        component.countryControl.setValue({
          name: 'Australia',
          iso2: 'au'
        });

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('Australia');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('au');
      }));

      it('should display the default country first in the result list with not selection', fakeAsync(() => {
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('Cyprus (Κύπρος)');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('cy');
      }));

      it('should only display supported countries', fakeAsync(() => {
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['au', 'us'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('United States');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('us');

        expect(results[1].innerText.trim()).toBe('Australia');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('au');

        expect(results.length).toBe(2);
      }));

      it('should display the default country second in the result list with a selection', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('United States');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('us');
        expect(results[1].innerText.trim()).toBe('Cyprus (Κύπρος)');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('cy');
      }));

      it('should clear the selection when all search text is cleared', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('', fixture);
        blurInput(fixture);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryControl.value).toBeUndefined();
        expect(nativeElement.querySelector('textarea').value).toBe('');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
      }));

      it('should disable the field correctly', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        component.isDisabled = true;
        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement = nativeElement.querySelector('textarea');

        expect(component.countryFieldComponent.disabled).toBeTruthy();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'mousedown');
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusin');
        fixture.detectChanges();
        tick();

        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
      }));

      it('should enable the field correctly', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        component.isDisabled = true;
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement = nativeElement.querySelector('textarea');

        expect(component.countryFieldComponent.disabled).toBeTruthy();
        component.isDisabled = false;
        fixture.detectChanges();
        tick();

        SkyAppTestUtility.fireDomEvent(textAreaElement, 'mousedown');
        fixture.detectChanges();
        tick();

        expect(component.countryFieldComponent.disabled).toBeFalsy();
        expect(component.countryFieldComponent.isInputFocused).toBeTruthy();

        component.countryFieldComponent.isInputFocused = false;
        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusin');
        fixture.detectChanges();

        expect(component.countryFieldComponent.isInputFocused).toBeTruthy();
      }));

      it('should mark the form as touched when the form loses focus', fakeAsync(() => {
        fixture.detectChanges();
        const textAreaElement = getInputElement();
        expect(component.countryForm.touched).toEqual(false);

        SkyAppTestUtility.fireDomEvent(textAreaElement, 'blur');
        tick();
        fixture.detectChanges();

        expect(component.countryForm.touched).toEqual(true);
      }));

      it('should emit the countryChange event correctly', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'countryChanged').and.callThrough();
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });
      }));

      it('should emit the valueChange form control event correctly with an initial value', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'formValueChanged').and.callThrough();
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });
      }));

      it('should emit the valueChange form control event correctly when no initial value', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'formValueChanged').and.callThrough();
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });
      }));

      it('should emit the valueChange form control event correctly when initialized to undefined', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'formValueChanged').and.callThrough();
        component.initiallizeToUndefined = true;
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });
      }));

    });

    describe('validation', () => {

      it('should mark the form invalid when it is empty and required', fakeAsync(() => {
        fixture.detectChanges();
        component.isRequired = true;
        fixture.detectChanges();
        tick();
        component.countryControl.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm.valid).toEqual(false);
      }));

      it('should mark the form valid when it is set and required', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        component.isRequired = true;
        fixture.detectChanges();
        tick();
        component.countryControl.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm.valid).toEqual(true);
      }));

      it('should mark the form invalid when it is set to a non-real country', fakeAsync(() => {
        component.initialValue = {
          name: 'Test Country',
          iso2: 'xx'
        };
        fixture.detectChanges();
        component.countryControl.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm.valid).toEqual(false);
      }));

      it('should mark the form valid when it is set to a real country', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        component.countryControl.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm.valid).toEqual(true);
      }));

      it('should mark the form valid when it is set to a supported country', fakeAsync(() => {
        component.initialValue = {
          name: 'Australia',
          iso2: 'au'
        };
        component.supportedCountryISOs = ['au', 'de'];
        fixture.detectChanges();
        component.countryControl.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm.valid).toEqual(true);
      }));

      it('should mark the form invalid when it is set to a non-supported country', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        component.supportedCountryISOs = ['au', 'de'];
        fixture.detectChanges();
        component.countryControl.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm.valid).toEqual(false);
      }));

    });

    describe('a11y', () => {

      it('should be accessible (empty)', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(document.body).toBeAccessible();
        });
      }));

      it('should be accessible (populated)', async(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(document.body).toBeAccessible();
        });
      }));

    });

  });

  describe('no form', () => {

    let fixture: ComponentFixture<CountryFieldNoFormTestComponent>;
    let component: CountryFieldNoFormTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          CountryFieldNoFormTestComponent
        ],
        imports: [
          SkyCountryFieldModule
        ]
      });

      fixture = TestBed.createComponent(CountryFieldNoFormTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    describe('usage', () => {

      it('should change countries correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(nativeElement.querySelector('textarea').value).toBe('');

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('Australia');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('au');
      }));

      it('should display the default country first in the result list with not selection', fakeAsync(() => {
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('Cyprus (Κύπρος)');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('cy');
      }));

      it('should only display supported countries', fakeAsync(() => {
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['au', 'us'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('United States');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('us');

        expect(results[1].innerText.trim()).toBe('Australia');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('au');

        expect(results.length).toBe(2);
      }));

      it('should display the default country second in the result list with a selection', fakeAsync(() => {
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('Australia');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('au');
        expect(results[1].innerText.trim()).toBe('Cyprus (Κύπρος)');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('cy');
      }));

      it('should clear the selection when all search text is cleared', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('', fixture);
        blurInput(fixture);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
      }));

      it('should disable the field correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        component.isDisabled = true;
        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement = nativeElement.querySelector('textarea');

        expect(component.countryFieldComponent.disabled).toBeTruthy();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'mousedown');
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusin');
        fixture.detectChanges();
        tick();

        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
      }));

      it('should enable the field correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        component.isDisabled = true;
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement = nativeElement.querySelector('textarea');

        expect(component.countryFieldComponent.disabled).toBeTruthy();
        component.isDisabled = false;
        fixture.detectChanges();
        tick();

        SkyAppTestUtility.fireDomEvent(textAreaElement, 'mousedown');
        fixture.detectChanges();
        tick();

        expect(component.countryFieldComponent.disabled).toBeFalsy();
        expect(component.countryFieldComponent.isInputFocused).toBeTruthy();

        component.countryFieldComponent.isInputFocused = false;
        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusin');
        fixture.detectChanges();

        expect(component.countryFieldComponent.isInputFocused).toBeTruthy();
      }));

      it('should emit the countryChange event correctly', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'countryChanged').and.callThrough();
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });
      }));

    });

    describe('a11y', () => {

      it('should be accessible (empty)', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(document.body).toBeAccessible();
        });
      }));

      it('should be accessible (populated)', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          const inputElement = getInputElement();
          inputElement.value = 'Austr';

          SkyAppTestUtility.fireDomEvent(inputElement, 'keyup');
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {

              const searchResults = getAutocompleteElement().querySelectorAll('.sky-autocomplete-result') as NodeListOf<HTMLElement>;

              // Note: the ordering of these events is important!
              SkyAppTestUtility.fireDomEvent(inputElement, 'change');
              SkyAppTestUtility.fireDomEvent(searchResults[0], 'mousedown');
              SkyAppTestUtility.fireDomEvent(getInputElement(), 'blur');

              fixture.detectChanges();
              fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(document.body).toBeAccessible();
              });
            });
          });
        });
      }));

    });

  });

});
