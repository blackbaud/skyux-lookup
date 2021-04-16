import {
  SkyLookupSelectMode
} from './lookup-select-mode';

import {
  SkyLookupShowMoreConfig
} from './lookup-show-more-config';

/**
 * @internal
 * Context for the show more modal. These values are provided by the lookup component.
 */
 export class SkyLookupShowMoreContext {
  public items: any[];
  public descriptorProperty: any;
  public initialSearch: string;
  public initialValue: any;
  public selectMode: SkyLookupSelectMode;
  public showAddButton: boolean;
  public userConfig: SkyLookupShowMoreConfig;
}
