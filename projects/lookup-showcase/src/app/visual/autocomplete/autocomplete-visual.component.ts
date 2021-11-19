import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  SkyAutocompleteSearchAsyncArgs,
  SkyAutocompleteSelectionChange,
} from 'projects/lookup/src/public-api';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'autocomplete-visual',
  templateUrl: './autocomplete-visual.component.html',
})
export class AutocompleteVisualComponent implements OnInit {
  public reactiveForm: FormGroup;

  public templateDrivenModel: any;

  public data: any[] = [
    { name: 'Red' },
    { name: 'Blue' },
    { name: 'Green' },
    { name: 'Orange' },
    { name: 'Pink' },
    { name: 'Purple' },
    { name: 'Yellow' },
    { name: 'Brown' },
    { name: 'Turquoise' },
    { name: 'White' },
    { name: 'Black' },
  ];

  public templateDisabledState: boolean = false;

  private reactiveDisabledState: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      favoriteColor: undefined,
      favoriteColorAsync: undefined,
    });
  }

  public toggleReactiveDisabled(): void {
    if (this.reactiveDisabledState) {
      this.reactiveForm.get('favoriteColor').enable();
    } else {
      this.reactiveForm.get('favoriteColor').disable();
    }

    this.reactiveDisabledState = !this.reactiveDisabledState;
  }

  public toggleTemplateDisabled(): void {
    this.templateDisabledState = !this.templateDisabledState;
  }

  public onSelectionChange(event: SkyAutocompleteSelectionChange): void {
    console.log(event);
  }

  public favoriteColorSearch(args: SkyAutocompleteSearchAsyncArgs): void {
    const searchText = (args.searchText || '').toLowerCase();

    const filteredData = this.data.filter(
      (item) => item.name.toLowerCase().indexOf(searchText) >= 0
    );

    args.result = of({
      items: filteredData,
      totalCount: filteredData.length,
    }).pipe(delay(1000));
  }
}
