import {
  NgModule
} from '@angular/core';

import {
  SkySearchModule
} from '@skyux/lookup';

@NgModule({
  imports: [
    SkySearchModule
  ],
  exports: [
    SkySearchModule
  ]
})
export class SkySearchTestingModule { }
