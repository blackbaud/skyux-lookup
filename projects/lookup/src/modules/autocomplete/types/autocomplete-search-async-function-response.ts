import { Observable } from 'rxjs';

export type SkyAutocompleteSearchAsyncFunctionResponse = Observable<
  {
    selected?: boolean;
    value?: unknown;
  }[]
>;
