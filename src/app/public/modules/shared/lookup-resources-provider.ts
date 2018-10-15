import {
  Observable
} from 'rxjs/Observable';

import {
  SkyLibResourcesProvider
} from '@skyux/i18n';

export class SkyLookupResourcesProvider implements SkyLibResourcesProvider {
  public getDefaultString: (name: string, ...args: any[]) => string;

  public getString: (name: string, ...args: any[]) => Observable<string>;
}
