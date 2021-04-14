import {
  SkyLookupShowMoreCustomPickerContext
} from './lookup-show-more-custom-picker-context';

export interface SkyLookupCustomPicker {

  open: (
    pickerContext: SkyLookupShowMoreCustomPickerContext
  ) => void;

}
