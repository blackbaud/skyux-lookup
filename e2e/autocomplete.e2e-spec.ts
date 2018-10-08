import {
  browser,
  by,
  element
} from 'protractor';

import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

describe('Autocomplete', () => {
  function validateScreenshot(done: DoneFn) {
    expect('#autocomplete-visual').toMatchBaselineScreenshot(done);
  }

  function validateScreenshotWithMenu(done: DoneFn) {
    const input = element(by.css('input'));
    input.value = 'r';
    input.click();
    browser.actions().sendKeys('r').perform();

    browser.wait(() => {
      return browser.isElementPresent(
        element(by.css('.sky-dropdown-item'))
      );
    });

    validateScreenshot(done);
  }

  beforeEach(() => {
    SkyHostBrowser.get('visual/autocomplete');
  });

  describe('(lg screens)', () => {
    beforeEach(() => {
      SkyHostBrowser.setWindowBreakpoint('lg');
    });

    it('should match previous autocomplete screenshot', (done) => {
      validateScreenshotWithMenu(done);
    });
  });

  describe('(xs screens)', () => {
    beforeEach(() => {
      SkyHostBrowser.setWindowBreakpoint('xs');
    });

    it('should match previous autocomplete screenshot', (done) => {
      validateScreenshotWithMenu(done);
    });
  });
});
