import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyAppWindowRef,
  SkyModalProviderModule
} from '@skyux/core';

import {
  SkyTokensModule
} from '@skyux/indicators';

import {
  SkyLookupComponent
} from './lookup.component';

import {
  SkyAutocompleteModule
} from '../autocomplete/autocomplete.module';

@NgModule({
  declarations: [
    SkyLookupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAutocompleteModule,
    SkyModalProviderModule,
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
