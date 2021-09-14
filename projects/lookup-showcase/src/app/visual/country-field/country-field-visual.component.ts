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
} from 'projects/lookup/src/public-api';

@Component({
  selector: 'country-field-visual',
  templateUrl: './country-field-visual.component.html',
  styleUrls: ['./country-field-visual.component.scss']
})
export class CountryFieldVisualComponent implements OnInit {

  public countryData: SkyCountryFieldCountry;

  public countryDataInputBox: SkyCountryFieldCountry;

  public countryForm: FormGroup;

  public countryControl: FormControl;

  public disableFields: boolean = false;

  public ngOnInit(): void {
    this.countryControl = new FormControl();
    this.countryControl.setValue({
      name: 'Australia',
      iso2: 'au'
    });
    this.countryForm = new FormGroup({
      'countryControl': this.countryControl
    });

    this.countryDataInputBox = {
      name: 'Australia',
      iso2: 'AU'
    };

    this.countryControl.setValidators([Validators.required]);

    this.countryControl.valueChanges.subscribe(value => console.log(value));
  }

  public toggleDisabledStates(): void {
    if (this.disableFields) {
      this.countryControl.enable();
      this.disableFields = false;
    } else {
      this.countryControl.disable();
      this.disableFields = true;
    }
  }

  public toggleGermany(): void {
    this.countryControl.setValue({ iso2: 'de' });
  }
}
