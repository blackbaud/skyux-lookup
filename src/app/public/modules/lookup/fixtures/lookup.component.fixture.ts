import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  SkyLookupComponent
} from '../lookup.component';

import {
  SkyLookupSelectMode
} from '../types/lookup-select-mode';

import {
  SkyLookupShowMoreConfig
} from '../types/lookup-show-more-config';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './lookup.component.fixture.html'
})
export class SkyLookupTestComponent implements OnInit {

  @ViewChild(SkyLookupComponent, {
    read: SkyLookupComponent,
    static: true
  })
  public lookupComponent: SkyLookupComponent;

  @ViewChild('customSearchResultTemplate')
  public searchResultTemplate: TemplateRef<any>;

  @ViewChild('customShowMoreTemplate')
  public showMoreTemplate: TemplateRef<any>;

  public ariaLabel: string;
  public ariaLabelledBy: string;
  public autocompleteAttribute: string;
  public data: any[];
  public descriptorProperty: string;
  public enabledSearchResultTemplate: TemplateRef<any>;
  public friends: any[];
  public form: FormGroup;
  public idProperty: string;
  public placeholderText: string;
  public selectMode: SkyLookupSelectMode;
  public showAddButton: boolean = false;
  public showMoreButton: boolean = false;
  public showMoreModalConfig: SkyLookupShowMoreConfig;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.data = [
      {
        name: 'Andy',
        description: 'Mr. Andy',
        birthDate: '1/1/1995'
      },
      { name: 'Beth' },
      { name: 'Dan' },
      { name: 'David' },
      { name: 'Frank' },
      { name: 'Fred' },
      { name: 'Isaac' },
      { name: 'John' },
      { name: 'Joyce' },
      { name: 'Lindsey' },
      { name: 'Mitch' },
      { name: 'Oliver' },
      {
        name: 'Patty',
        description: 'Ms. Patty',
        birthDate: '1/1/1996'
      },
      {
        name: 'Paul',
        description: 'Mr. Paul',
        birthDate: '11/1997'
      },
      { name: 'Sally' },
      { name: 'Susan' },
      { name: 'Vanessa' },
      { name: 'Vinny' },
      { name: 'Xavier' },
      { name: 'Yolanda' },
      { name: 'Zack' }
    ];

    this.createForm();
  }

  public addButtonClicked(): void {
    return;
  }

  public enableLookup(): void {
    this.form.controls.friends.enable();
  }

  public enableSearchResultTemplate(): void {
    this.enabledSearchResultTemplate = this.searchResultTemplate;
  }

  public disableLookup(): void {
    this.form.controls.friends.disable();
  }

  public setMultiSelect(): void {
    this.selectMode = SkyLookupSelectMode.multiple;
  }

  public setRequired(): void {
    this.form.controls.friends.setValidators([Validators.required]);
  }

  public setShowMoreModalConfig(config: SkyLookupShowMoreConfig): void {
    this.showMoreModalConfig = config;
  }

  public setSingleSelect(): void {
    this.selectMode = SkyLookupSelectMode.single;
  }

  public removeRequired(): void {
    this.form.controls.friends.setValidators([]);
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      friends: new FormControl(this.friends)
    });
  }
}
