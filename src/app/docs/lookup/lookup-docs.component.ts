import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

import {
  SkyAutocompleteSearchFunctionFilter
} from '@skyux/lookup';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import {
  SkyLookupAddCallbackArgs,
  SkyLookupAddClickEventArgs,
  SkyLookupSelectModeType
} from '../../public/public_api';

import {
  SkyLookupDocsDemoModalComponent
} from './lookup-docs-demo-modal.component';

@Component({
  selector: 'app-lookup-docs',
  templateUrl: './lookup-docs.component.html'
})
export class LookupDocsComponent implements OnInit {

  public names: any[] = [
    { name: 'Shirley' }
  ];

  public myForm: FormGroup;

  public people: any[] = [
    { name: 'Abed' },
    { name: 'Alex' },
    { name: 'Ben' },
    { name: 'Britta' },
    { name: 'Buzz' },
    { name: 'Craig' },
    { name: 'Elroy' },
    { name: 'Garrett' },
    { name: 'Ian' },
    { name: 'Jeff' },
    { name: 'Leonard' },
    { name: 'Neil' },
    { name: 'Pierce' },
    { name: 'Preston' },
    { name: 'Rachel' },
    { name: 'Shirley' },
    { name: 'Todd' },
    { name: 'Troy' },
    { name: 'Vaughn' },
    { name: 'Vicki' }
  ];

  public selectMode: SkyLookupSelectModeType = 'multiple';

  public selectModeChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'multiple', label: 'Multiple' },
    { value: 'single', label: 'Single' }
  ];

  public showAddButton: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: SkyModalService
  ) { }

  public ngOnInit(): void {
    this.createForm();
  }

  public addButtonClicked(addButtonClickArgs: SkyLookupAddClickEventArgs): void {
    console.log('clicked');

    const modalInstance = this.modalService.open(SkyLookupDocsDemoModalComponent);
    modalInstance.closed.subscribe((modalCloseArgs: SkyModalCloseArgs) => {
      if (modalCloseArgs.reason === 'save') {
        let newItem: any = { name: modalCloseArgs.data };

        this.people.push({ name: modalCloseArgs.data });
        this.people = this.people.sort((a, b) => {
          return a.name.localeCompare(b.name);
       }).slice();

       const callbackArgs: SkyLookupAddCallbackArgs = {
         item: newItem,
         data: this.people
       };
       addButtonClickArgs.itemAdded(callbackArgs);
      }
    });
  }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.selectMode !== undefined) {
      this.selectMode = change.selectMode;
    }
    if (change.showAddButton !== undefined) {
      this.showAddButton = change.showAddButton;
    }
  }

  // Only show people in the search results that have not been chosen already.
  public getSearchFilters(): SkyAutocompleteSearchFunctionFilter[] {
    const names: any[] = this.myForm.controls.names.value;
    return [
      (searchText: string, item: any): boolean => {
        const found = names.find(option => option.name === item.name);
        return !found;
      }
    ];
  }

  private createForm(): void {
    this.myForm = this.formBuilder.group({
      names: new FormControl(this.names)
    });
  }
}
