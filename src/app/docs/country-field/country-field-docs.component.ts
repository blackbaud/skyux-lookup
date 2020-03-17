import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';

import {
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyCountryFieldCountry
} from '../../public/modules/country-field/types/country';

@Component({
  selector: 'app-country-field-docs',
  templateUrl: './country-field-docs.component.html',
  styleUrls: ['./country-field-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryFieldDocsComponent implements OnInit {

  public countryControl: FormControl;

  public countryData: SkyCountryFieldCountry;

  public countryForm: FormGroup;

  constructor() { }

  public ngOnInit(): void {
    this.countryControl = new FormControl();
    this.countryForm = new FormGroup({
      'countryControl': this.countryControl
    });
  }

}
