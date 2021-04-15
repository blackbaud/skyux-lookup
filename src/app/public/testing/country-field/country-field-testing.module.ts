import {
  NgModule
} from '@angular/core';

import {
  SkyCountryFieldModule
} from '@skyux/lookup';

@NgModule({
  imports: [
    SkyCountryFieldModule
  ],
  exports: [
    SkyCountryFieldModule
  ]
})
export class SkyCountryFieldTestingModule { }
