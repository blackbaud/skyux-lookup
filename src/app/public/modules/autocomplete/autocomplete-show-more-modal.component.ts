import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataManagerService
} from '@skyux/data-manager';
import { SkyModalInstance } from '@skyux/modals';
import { SkyAutocompleteShowMoreContext } from './types/autocomplete-show-more-context';

@Component({
  selector: 'skyux-autocomplete-show-more-modal',
  templateUrl: './autocomplete-show-more-modal.component.html',
  providers: [SkyDataManagerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyAutocompleteShowMoreModalComponent implements OnInit {
  public items: any[];

  public dataManagerConfig = {
    sortOptions: [
      {
        id: 'az',
        label: 'Alphabetical (A - Z)',
        descending: false,
        propertyName: 'name'
      },
      {
        id: 'za',
        label: 'Alphabetical (Z - A)',
        descending: true,
        propertyName: 'name'
      }
    ]
  };

  public dataState = new SkyDataManagerState({});
  public displayedItems: any[] = [];
  public itemsHaveMore: boolean = false;
  public viewId = 'repeaterView';
  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Repeater View',
    icon: 'list',
    searchEnabled: true,
    filterButtonEnabled: false,
    multiselectToolbarEnabled: true,
    onClearAllClick: this.clearAll.bind(this),
    onSelectAllClick: this.selectAll.bind(this)
  };

  private itemIndex: number = 0;

  constructor(
    public modalInstance: SkyModalInstance,
    public context: SkyAutocompleteShowMoreContext,
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
    ) { }

  public ngOnInit(): void {
    setTimeout(() => {
      this.addItems();
    });

    this.dataManagerService.initDataView(this.viewConfig);

    this.dataManagerService.getDataStateUpdates(this.viewId).subscribe(state => {
      this.dataState = state;
      this.updateData();
    });

    this.dataManagerService.initDataManager(
      {
        activeViewId: 'repeaterView',
        dataManagerConfig: this.dataManagerConfig,
        defaultDataState: this.dataState
      }
    );
  }

  public addItems(): void {
    this.items = this.context.items;
    this.displayedItems = this.displayedItems.concat(this.context.items.slice(this.itemIndex, this.itemIndex + 5));
    this.itemIndex = this.itemIndex + 5;
    if (this.itemIndex > this.items.length) {
      this.itemsHaveMore = false;
    } else {
      this.itemsHaveMore = true;
    }
  }

  public updateData(): void {
    let selectedIds = this.dataState.selectedIds || [];
    this.items.forEach(item => {
      item.selected = selectedIds.indexOf(item.id) !== -1;
    });
    this.displayedItems = this.searchItems(this.items);

    if (this.dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter(item => item.selected);
    }

    this.changeDetector.detectChanges();
  }

  public searchItems(items: any[]): any[] {
    let searchedItems = items;
    let searchText = this.dataState && this.dataState.searchText;

    if (searchText) {
      searchedItems = items.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (item.hasOwnProperty(property) && (property === 'name' || property === 'description')) {
            const propertyText = item[property].toLowerCase();
            if (propertyText.indexOf(searchText) > -1) {
              return true;
            }
          }
        }

        return false;
      });
    }
    return searchedItems;
  }

  public selectAll(): void {
    let selectedIds = this.dataState.selectedIds || [];

    this.displayedItems.forEach(item => {
      if (!item.selected) {
        item.selected = true;
        selectedIds.push(item.id);
      }
    });

    this.dataState.selectedIds = selectedIds;
    this.dataManagerService.updateDataState(this.dataState, this.viewId);
    this.changeDetector.markForCheck();
  }

  public clearAll(): void {
    let selectedIds = this.dataState.selectedIds || [];

    this.displayedItems.forEach(item => {
      if (item.selected) {
        let itemIndex = selectedIds.indexOf(item.id);
        item.selected = false;
        selectedIds.splice(itemIndex, 1);
      }
    });
    this.dataState.selectedIds = selectedIds;
    this.dataManagerService.updateDataState(this.dataState, this.viewId);
    this.changeDetector.markForCheck();
  }

  public onItemSelect(isSelected: boolean, item: any): void {
    let selectedItems = this.dataState.selectedIds || [];
    let itemIndex = selectedItems.indexOf(item.id);

    if (isSelected && itemIndex === -1) {
      selectedItems.push(item.id);
    } else if (!isSelected && itemIndex !== -1) {
      selectedItems.splice(itemIndex, 1);
    }

    this.dataState.selectedIds = selectedItems;
    this.dataManagerService.updateDataState(this.dataState, this.viewId);
  }
}
