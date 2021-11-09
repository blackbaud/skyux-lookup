import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup
} from '@angular/forms';

import {
  SkyAutocompleteSearchAsyncFunction,
  SkyAutocompleteSelectionChange
} from 'projects/lookup/src/public-api';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'autocomplete-visual',
  templateUrl: './autocomplete-visual.component.html'
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
    { name: 'Black' }
  ];

  public templateDisabledState: boolean = false;

  public favoriteColorSearchFn: SkyAutocompleteSearchAsyncFunction;

  private reactiveDisabledState: boolean = false;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.favoriteColorSearchFn = (args) => {
      const searchText = (args.searchText || '').toLowerCase();

      const filteredData = this.data.filter(
        item => item.name.toLowerCase().indexOf(searchText) >= 0
      );

      return of(filteredData).pipe(delay(1000));
    }
  }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      favoriteColor: undefined,
      favoriteColorAsync: undefined
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

}
