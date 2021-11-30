import { SkyAutocompleteSearchFunction } from './types/autocomplete-search-function';

import { SkyAutocompleteSearchFunctionFilter } from './types/autocomplete-search-function-filter';

import { SkyAutocompleteSearchFunctionResponse } from './types/autocomplete-search-function-response';

import { SkyAutocompleteDefaultSearchFunctionOptions } from './types/autocomplete-default-search-function-options';

export function skyAutocompleteDefaultSearchFunction(
  options: SkyAutocompleteDefaultSearchFunctionOptions
): SkyAutocompleteSearchFunction {
  const filterData = function (searchText: string, data: any[]): any[] {
    return data.filter((item: any) => {
      if (!options.searchFilters || !options.searchFilters.length) {
        return true;
      }

      // Find the first failing filter (we can skip the others if one fails).
      const failedFilter = options.searchFilters.find(
        (filter: SkyAutocompleteSearchFunctionFilter) => {
          return !filter.call({}, searchText, item);
        }
      );

      return failedFilter === undefined;
    });
  };

  const normalizeDiacritics = function (value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const normalizeSearchText = function (value: string): string {
    return normalizeDiacritics(value).toUpperCase();
  };

  const normalizeData = function (value: string): string {
    return normalizeDiacritics(value || '')
      .toString()
      .toUpperCase();
  };

  const search = function (
    searchText: string,
    data: any[]
  ): SkyAutocompleteSearchFunctionResponse {
    const results = [];

    /* Sanity check - autocomplete will not call search with empty search text */
    /* istanbul ignore if */
    if (!searchText) {
      return results;
    }

    const normalizedSearchText = normalizeSearchText(searchText);
    const filteredData = filterData(searchText, data);

    for (let i = 0, n = filteredData.length; i < n; i++) {
      const result = filteredData[i];
      const isMatch = options.propertiesToSearch.find((property: string) => {
        const value = normalizeData(result[property]);
        return value.indexOf(normalizedSearchText) > -1;
      });

      if (isMatch) {
        results.push(result);
      }
    }

    return results;
  };

  return search;
}
