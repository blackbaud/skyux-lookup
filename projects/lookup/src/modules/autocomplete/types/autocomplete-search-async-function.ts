import { SkyAutocompleteSearchAsyncFunctionArgs } from './autocomplete-search-async-function-args';
import {
  SkyAutocompleteSearchAsyncFunctionResponse
} from './autocomplete-search-async-function-response';

export type SkyAutocompleteSearchAsyncFunction =
  (args: SkyAutocompleteSearchAsyncFunctionArgs) => SkyAutocompleteSearchAsyncFunctionResponse;
