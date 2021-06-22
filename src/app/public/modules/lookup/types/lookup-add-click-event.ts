/**
 * Specifies a callback function for the consumer to use to notify the lookup that a new item has been added.
 */
export interface SkyLookupAddMoreClickedEvent {

  /**
   * A callback function for the consumer to use to notify the lookup that a new item has been added.
   * @param item The new item which has been added to the data. This item will be automatically selected.
   * @param data The new state of the data source for the lookup component to search when users
   * enter text. If not specified, the component will use the current state of the lookup
   * component's `data` input; however, if this is not yet updated the new item will not be
   * automatically selected.
   */
  itemAdded: (item: any, data?: any[]) => void;
}
