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
  SkyIconModule,
  SkyTextHighlightModule
} from '@skyux/indicators';

import {
  SkyModalModule
} from '@skyux/modals';

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
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyInfiniteScrollModule, SkyRepeaterModule } from '@skyux/lists';

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
    SkyRepeaterModule
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
