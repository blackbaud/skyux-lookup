import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutocompleteVisualComponent } from './visual/autocomplete/autocomplete-visual.component';
import { CountryFieldVisualComponent } from './visual/country-field/country-field-visual.component';
import { LookupVisualComponent } from './visual/lookup/lookup-visual.component';
import { SearchVisualComponent } from './visual/search/search-visual.component';
import { VisualComponent } from './visual/visual.component';

const routes: Routes = [
  {
    path: '',
    component: VisualComponent,
  },
  {
    path: 'visual/autocomplete',
    component: AutocompleteVisualComponent,
  },
  {
    path: 'visual/country-field',
    component: CountryFieldVisualComponent,
  },
  {
    path: 'visual/lookup',
    component: LookupVisualComponent,
  },
  {
    path: 'visual/search',
    component: SearchVisualComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
