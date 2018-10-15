import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyLookupResourcesProvider
} from './lookup-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyLookupResourcesProvider,
    multi: true
  }]
})
export class SkyLookupResourcesModule { }
