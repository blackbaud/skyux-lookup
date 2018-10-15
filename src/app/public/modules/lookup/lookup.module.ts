import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SkyAutocompleteModule } from '../autocomplete';
import { SkyTokensModule } from '@skyux/indicators';

import {
  SkyLookupResourcesModule
} from '../shared';

import { SkyLookupComponent } from './lookup.component';

@NgModule({
  declarations: [
    SkyLookupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAutocompleteModule,
    SkyLookupResourcesModule,
    SkyTokensModule
  ],
  exports: [
    SkyLookupComponent
  ]
})
export class SkyLookupModule { }
