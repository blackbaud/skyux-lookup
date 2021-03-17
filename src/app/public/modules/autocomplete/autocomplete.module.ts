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
  SkyAffixModule,
  SkyOverlayModule
} from '@skyux/core';

import {
  SkyDataManagerModule
} from '@skyux/data-manager';

import {
  SkyIconModule,
  SkyTextHighlightModule
} from '@skyux/indicators';

import {
  SkyInfiniteScrollModule,
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyLookupResourcesModule
} from '../shared/lookup-resources.module';

import {
  SkyAutocompleteComponent
} from './autocomplete.component';

import {
  SkyAutocompleteAdapterService
} from './autocomplete-adapter.service';

import {
  SkyAutocompleteInputDirective
} from './autocomplete-input.directive';

import {
  SkyAutocompleteShowMoreModalComponent
} from './autocomplete-show-more-modal.component';

@NgModule({
  declarations: [
    SkyAutocompleteComponent,
    SkyAutocompleteInputDirective,
    SkyAutocompleteShowMoreModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAffixModule,
    SkyDataManagerModule,
    SkyTextHighlightModule,
    SkyIconModule,
    SkyInfiniteScrollModule,
    SkyLookupResourcesModule,
    SkyModalModule,
    SkyOverlayModule,
    SkyRepeaterModule,
    SkyThemeModule
  ],
  entryComponents: [
    SkyAutocompleteShowMoreModalComponent
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
