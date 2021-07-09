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
  SkyIdModule
} from '@skyux/core';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyLookupResourcesModule
} from '../shared/lookup-resources.module';

import {
  SkySearchComponent
} from './search.component';

@NgModule({
  declarations: [
    SkySearchComponent
  ],
  imports: [
    CommonModule,
    SkyInputBoxModule,
    SkyLookupResourcesModule,
    FormsModule,
    SkyIconModule,
    SkyThemeModule,
    SkyIdModule
  ],
  exports: [
    SkySearchComponent
  ]
})
export class SkySearchModule { }
