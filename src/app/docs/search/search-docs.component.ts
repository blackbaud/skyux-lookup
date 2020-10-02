import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-search-docs',
  templateUrl: './search-docs.component.html'
})
export class SearchDocsComponent {

  public displayedItems: any;

  private items: any[] = [
    {
      title: 'Call Robert Hernandez'
    },
    {
      title: 'Send invitation to ball'
    },
    {
      title: 'Clean up desk'
    },
    {
      title: 'Investigate leads'
    },
    {
      title: 'Send thank you note'
    }
  ];

  public searchText: string;

  constructor() {
    this.displayedItems = this.items;
  }

  public searchApplied(searchText: string): void {
    let filteredItems = this.items;
    this.searchText = searchText;

    if (searchText) {
      filteredItems = this.items.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (item.hasOwnProperty(property) && (property === 'title' || property === 'note')) {
            if (item[property].indexOf(searchText) > -1) {
              return true;
            }
          }
        }

        return false;
      });
    }
    this.displayedItems = filteredItems;
  }
}
