import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  SkyCountryFieldCountry
} from '../../public/modules/country-field/types';

@Component({
  selector: 'country-field-visual',
  templateUrl: './country-field-visual.component.html'
})
export class CountryFieldVisualComponent implements OnInit {

  public countryData: SkyCountryFieldCountry;

  public countryForm: FormGroup;

  public countryControl: FormControl;

  public disableFields: boolean = false;

  constructor() { }

  public ngOnInit() {
    this.countryControl = new FormControl();
    this.countryControl.setValue({
      name: 'Australia',
      iso2: 'au'
    });
    this.countryForm = new FormGroup({
      'countryControl': this.countryControl
    });

    this.countryControl.setValidators([Validators.required]);
  }

  public toggleDisabledStates() {
    if (this.disableFields) {
      this.countryControl.enable();
      this.disableFields = false;
    } else {
      this.countryControl.disable();
      this.disableFields = true;
    }
  }
}
