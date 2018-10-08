import {
  browser,
  by,
  element
} from 'protractor';

import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

describe('Lookup component', () => {
  function validateScreenshot(done: DoneFn) {
    expect('#lookup-visual').toMatchBaselineScreenshot(done);
  }

  function validateScreenshotWithMenu(done: DoneFn) {
    const input = element(by.css('textarea'));
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
    SkyHostBrowser.get('visual/lookup');
  });

  describe('(lg screens)', () => {
    beforeEach(() => {
      SkyHostBrowser.setWindowBreakpoint('lg');
    });

    it('should match previous lookup screenshot', (done) => {
      validateScreenshot(done);
    });

    it('should match previous lookup w/ menu screenshot', (done) => {
      validateScreenshotWithMenu(done);
    });

    it('should match previous disabled lookup screenshot', (done) => {
      const btn = element(by.css('#btn-disable-lookup'));
      btn.click();

      validateScreenshot(done);
    });
  });

  describe('(xs screens)', () => {
    beforeEach(() => {
      SkyHostBrowser.setWindowBreakpoint('xs');
    });

    it('should match previous lookup screenshot', (done) => {
      validateScreenshot(done);
    });

    it('should match previous lookup w/ menu screenshot', (done) => {
      validateScreenshotWithMenu(done);
    });
  });
});
