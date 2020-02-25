import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import {
  SkyAppWindowRef
} from '@skyux/core';

import 'intl-tel-input';

import {
  fromEvent,
  Subject
} from 'rxjs';

import {
  SkyAutocompleteInputDirective,
  SkyAutocompleteSelectionChange
} from '../autocomplete';

import {
  SkyCountryFieldCountry
} from './types';

@Component({
  selector: 'sky-country-field',
  templateUrl: './country-field.component.html',
  styleUrls: ['./country-field.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    /* tslint:disable-next-line:no-forward-ref */
    useExisting: forwardRef(() => SkyCountryFieldComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyCountryFieldComponent implements ControlValueAccessor, OnDestroy, OnInit {

  @Input()
  public set defaultCountry(value: string) {
    if (value !== this._defaultCountry) {
      this._defaultCountry = value.toLowerCase();

      this.defaultCountryData = this.countries
        .find(country => country.iso2 === this._defaultCountry);

      this.sortCountriesWithSelectedAndDefault(this.selectedCountry);
    }
  }

  public get defaultCountry(): string {
    return this._defaultCountry;
  }

  @Input()
  public disabled: boolean = false;

  @Output()
  public selectedCountryChange = new EventEmitter<SkyCountryFieldCountry>();

  public countries: SkyCountryFieldCountry[];

  public countrySearchForm: FormGroup;

  public isInPhoneField: boolean = false;

  public isInputFocused = false;

  @ViewChild(SkyAutocompleteInputDirective)
  public countrySearchAutocompleteDirective: SkyAutocompleteInputDirective;

  public set selectedCountry(newCountry: SkyCountryFieldCountry) {
    if (this._selectedCountry !== newCountry) {
      this._selectedCountry = newCountry;

      this.sortCountriesWithSelectedAndDefault(newCountry);

      this.countrySearchForm.get('countrySearch').setValue(this.selectedCountry);

      if (!this.isFirstChange) {
        this.onChange(newCountry);
        this.onTouched();

        this.selectedCountryChange.emit(newCountry);
      }

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.isFirstChange && this.control) {
        this.control.markAsPristine();
      }

      if (this.isFirstChange && newCountry !== null) {
        this.isFirstChange = false;
      }
    }
  }

  public get selectedCountry(): SkyCountryFieldCountry {
    return this._selectedCountry;
  }

  private control: AbstractControl;

  private defaultCountryData: SkyCountryFieldCountry;

  private idle = new Subject();

  private isFirstChange = true;

  private _defaultCountry: string;

  private _selectedCountry: SkyCountryFieldCountry;

  constructor(
    private formBuilder: FormBuilder,
    private windowRef: SkyAppWindowRef,
    private changeDetector: ChangeDetectorRef,
    private elRef: ElementRef
  ) {
    /**
     * The json functions here ensures that we get a copy of the array and not the global original.
     * This ensures that multiple instances of the component don't overwrite the original data.
     *
     * We must type the window object as any here as the intl-tel-input library adds its object
     * to the main window object.
     */
    this.countries = JSON.parse(JSON.stringify((window as any)
      .intlTelInputGlobals.getCountryData()));
    this.defaultCountryData = this.countries.find(country => country.iso2 === 'us');

    this.countrySearchForm = this.formBuilder.group({
      countrySearch: new FormControl()
    });

    if ((<HTMLElement>elRef.nativeElement.parentElement)
      .classList.contains('sky-phone-field-country-search')) {
      this.isInPhoneField = true;
    }
  }

  public ngOnInit(): void {
    if (!this.defaultCountry) {
      this.defaultCountry = 'us';
    }

    this.countrySearchForm.get('countrySearch').valueChanges.subscribe(newValue => {
      if (newValue) {
        this.selectedCountry = newValue;
      }
    });
    this.addEventListeners();
  }

  public ngOnDestroy(): void {
    this.selectedCountryChange.complete();
    this.removeEventListeners();
  }

  /**
   * Sets the country to validate against based on the county's iso2 code.
   * @param countryCode The International Organization for Standardization's two-letter code
   * for the default country.
   */
  public onCountrySelected(newCountry: SkyAutocompleteSelectionChange): void {
    if (newCountry.selectedItem) {
      this.writeValue(this.countries.find(countryInfo => countryInfo.iso2 ===
        newCountry.selectedItem.iso2));
    } else {
      this.writeValue(undefined);
    }
  }

  // Angular automatically constructs these methods.
  /* istanbul ignore next */
  public onChange = (value: SkyCountryFieldCountry) => { };
  /* istanbul ignore next */
  public onTouched = () => { };

  public registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  public setDisabledState(disabled: boolean) {
    this.removeEventListeners();

    if (!disabled) {
      this.addEventListeners();
    }

    this.disabled = disabled;
    this.changeDetector.markForCheck();
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (!this.control) {
      this.control = control;
    }
    return;
  }

  public writeValue(value: SkyCountryFieldCountry) {
    if (!this.disabled) {
      this.selectedCountry = value;
    }
  }

  private addEventListeners() {
    this.idle = new Subject();

    const documentObj = this.windowRef.nativeWindow.document;
    fromEvent(documentObj, 'mousedown').takeUntil(this.idle)
      .subscribe((event: MouseEvent) => {
        this.isInputFocused = this.elRef.nativeElement.contains(event.target);
        this.changeDetector.markForCheck();
      });

    fromEvent(documentObj, 'focusin')
      .takeUntil(this.idle)
      .subscribe((event: KeyboardEvent) => {
        this.isInputFocused = this.elRef.nativeElement.contains(event.target);
        this.changeDetector.markForCheck();
      });
  }

  private removeEventListeners() {
    this.idle.next();
    this.idle.complete();
  }

  private sortCountriesWithSelectedAndDefault(selectedCountry: SkyCountryFieldCountry): void {
    let selectedCountryIndex: number;
    let selectedCountryData;
    if (selectedCountry) {
      selectedCountryData = this.countries
        .find(country => country.iso2 === selectedCountry.iso2.toLocaleLowerCase());
      selectedCountryIndex = this.countries
        .indexOf(selectedCountryData);
      this.countries.splice(selectedCountryIndex, 1);
    }

    let sortedNewCountries = this.countries
      .sort((a, b) => {
        if ((a === this.defaultCountryData || a.name < b.name) && b !== this.defaultCountryData) {
          return -1;
        } else {
          return 1;
        }
      });

    if (selectedCountry) {
      sortedNewCountries.splice(0, 0, selectedCountryData);
    }
    this.countries = sortedNewCountries;
  }

}
