import {
  Injectable
} from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyLookupService {

  public isEquivalent(object1: any, object2: any): boolean {
    // Create arrays of property names
    const aProps = object1 ? Object.getOwnPropertyNames(object1) : [];
    const bProps = object2 ? Object.getOwnPropertyNames(object2) : [];

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
      return false;
    }

    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (object1[propName] !== object2[propName]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

}
