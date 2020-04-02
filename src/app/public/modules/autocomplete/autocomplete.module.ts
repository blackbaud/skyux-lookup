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
  SkyAffixModule,
  SkyOverlayModule
} from '@skyux/core';

import {
  SkyIconModule,
  SkyTextHighlightModule
} from '@skyux/indicators';

import {
  SkyAutocompleteComponent
} from './autocomplete.component';
import {
  SkyAutocompleteInputDirective
} from './autocomplete-input.directive';

import {
  SkyLookupResourcesModule
} from '../shared';
import { SkyAutocompleteAdapterService } from './autocomplete-adapter.service';

@NgModule({
  declarations: [
    SkyAutocompleteComponent,
    SkyAutocompleteInputDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAffixModule,
    SkyTextHighlightModule,
    SkyIconModule,
    SkyLookupResourcesModule,
    SkyOverlayModule
  ],
  exports: [
    SkyAutocompleteComponent,
    SkyAutocompleteInputDirective
  ],
  providers: [
    SkyAutocompleteAdapterService
  ]
})
export class SkyAutocompleteModule { }
