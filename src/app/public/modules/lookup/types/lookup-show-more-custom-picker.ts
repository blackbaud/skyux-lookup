import {
  SkyLookupShowMoreCustomPickerContext
} from './lookup-show-more-custom-picker-context';

/**
 * Interface for defining a custom lookup show more modal.
 */
export interface SkyLookupCustomPicker {

  open: (
    pickerContext: SkyLookupShowMoreCustomPickerContext
  ) => void;

}
