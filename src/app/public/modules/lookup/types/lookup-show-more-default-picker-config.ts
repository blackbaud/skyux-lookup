import {
  TemplateRef
} from '@angular/core';

/**
 * Configuration for the default lookup show more modal.
 */
export interface SkyLookupShowMoreDefaultPickerConfig {
  /**
   * Specifies a template to format each search result in the modal list.
   * The autocomplete component injects search result values into the template as item variables
   * that reference all of the object properties of the search results.
   */
  itemTemplate?: TemplateRef<any>;

  /**
   * Specifies the title of the modal.
   * @default 'Select an option/Select options'
   */
  title?: string;
}
