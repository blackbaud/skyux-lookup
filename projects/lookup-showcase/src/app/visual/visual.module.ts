import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkyE2eThemeSelectorModule } from '@skyux/e2e-client';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyAutocompleteModule, SkyCountryFieldModule, SkyLookupModule, SkySearchModule } from 'projects/lookup/src/public-api';
import { VisualComponent } from './visual.component';
import { AutocompleteVisualComponent } from './autocomplete/autocomplete-visual.component';
import { CountryFieldVisualComponent } from './country-field/country-field-visual.component';
import { LookupVisualCustomPickerComponent } from './lookup/lookup-visual-custom-picker.component';
import { LookupVisualComponent } from './lookup/lookup-visual.component';
import { SkyModalModule } from '@skyux/modals';
import { SkyIdModule } from '@skyux/core';
import { SearchVisualComponent } from './search/search-visual.component';



@NgModule({
  declarations: [
    AutocompleteVisualComponent,
    CountryFieldVisualComponent,
    LookupVisualCustomPickerComponent,
    LookupVisualComponent,
    SearchVisualComponent,
    VisualComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SkyAutocompleteModule,
    SkyE2eThemeSelectorModule,
    SkyCheckboxModule,
    SkyCountryFieldModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyLookupModule,
    SkyModalModule,
    SkySearchModule
  ]
})
export class VisualModule { }
