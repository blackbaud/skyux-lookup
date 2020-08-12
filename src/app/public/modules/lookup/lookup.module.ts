import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyAutofillModule
} from '@skyux/forms';

import {
  SkyTokensModule
} from '@skyux/indicators';

import {
  SkyAutocompleteModule
} from '../autocomplete/autocomplete.module';

import {
  SkyLookupComponent
} from './lookup.component';

@NgModule({
  declarations: [
    SkyLookupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAutocompleteModule,
    SkyAutofillModule,
    SkyTokensModule
  ],
  exports: [
    SkyLookupComponent
  ],
  providers: [
    SkyAppWindowRef
  ]
})
export class SkyLookupModule { }
