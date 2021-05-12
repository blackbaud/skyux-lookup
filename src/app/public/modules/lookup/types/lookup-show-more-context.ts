import {
  SkyLookupSelectMode
} from './lookup-select-mode';

import {
  SkyLookupShowMoreDefaultPickerConfig
} from './lookup-show-more-default-picker-config';

/**
 * @internal
 * Context for the show more modal. These values are provided by the lookup component.
 */
 export class SkyLookupShowMoreContext {
  public items: any[];
  public descriptorProperty: string;
  public initialSearch: string;
  public initialValue: any;
  public selectMode: SkyLookupSelectMode;
  public showAddButton: boolean;
  public userConfig: SkyLookupShowMoreDefaultPickerConfig;
}
