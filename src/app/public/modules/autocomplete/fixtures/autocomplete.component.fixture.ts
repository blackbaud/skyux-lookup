import {
  Component,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  NgForm
} from '@angular/forms';

import {
  SkyAutocompleteSearchFunction
} from '../types/autocomplete-search-function';

import {
  SkyAutocompleteSearchFunctionFilter
} from '../types/autocomplete-search-function-filter';

import {
  SkyAutocompleteSelectionChange
} from '../types/autocomplete-selection-change';

import {
  SkyAutocompleteComponent
} from '../autocomplete.component';

import {
  SkyAutocompleteInputDirective
} from '../autocomplete-input.directive';

@Component({
  selector: 'sky-autocomplete-fixture',
  templateUrl: './autocomplete.component.fixture.html'
})
export class SkyAutocompleteFixtureComponent {
  public data: any[] = [
    { name: 'Red', objectid: 'abc' },
    { name: 'Blue', objectid: 'def' },
    { name: 'Green', objectid: 'ghi' },
    { name: 'Orange', objectid: 'jkl' },
    { name: 'Pink', objectid: 'mno' },
    { name: 'Purple', objectid: 'pqr' },
    { name: 'Yellow', objectid: 'stu'},
    { name: 'Brown', objectid: 'vwx' },
    { name: 'Turquoise', objectid: 'yz0' },
    { name: 'White', objectid: '123' },
    { name: 'Black', objectid: '456' }
  ];

  public model: any = {
    favoriteColor: undefined
  };
  public customNoResultsMessage: string;
  public debounceTime: number;
  public descriptorProperty: string;
  public propertiesToSearch: string[];
  public search: SkyAutocompleteSearchFunction;
  public searchFilters: SkyAutocompleteSearchFunctionFilter[];
  public searchResultsLimit: number;
  public searchResultTemplate: TemplateRef<any>;
  public searchTextMinimumCharacters: number;
  public selectionFromChangeEvent: SkyAutocompleteSelectionChange;

  @ViewChild(SkyAutocompleteComponent, {
    read: SkyAutocompleteComponent,
    static: true
  })
  public autocomplete: SkyAutocompleteComponent;

  @ViewChild(SkyAutocompleteInputDirective, {
    read: SkyAutocompleteInputDirective,
    static: true
  })
  public autocompleteInput: SkyAutocompleteInputDirective;

  @ViewChild('myForm', {
    read: NgForm,
    static: true
  })
  public myForm: NgForm;

  @ViewChild('customSearchResultTemplate', {
    read: TemplateRef,
    static: true
  })
  public customSearchResultTemplate: TemplateRef<any>;

  public onSelectionChange(event: SkyAutocompleteSelectionChange): void {
    this.selectionFromChangeEvent = event;
  }
}
