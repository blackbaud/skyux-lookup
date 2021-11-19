import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skyLookupItemsForDisplay',
})
export class SkyLookupItemsForDisplayPipe implements PipeTransform {
  public transform(
    allItems: unknown[],
    idProperty: string,
    selectedIdMap: Map<unknown, unknown>,
    onlyShowSelected: boolean
  ): unknown[] {
    if (onlyShowSelected) {
      return allItems.filter((item) => selectedIdMap.has(item[idProperty]));
    }

    return allItems;
  }
}
