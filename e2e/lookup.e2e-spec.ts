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
  function validateScreenshot(done: DoneFn, screenshotName: string) {
    expect('#lookup-visual').toMatchBaselineScreenshot(done, {
      screenshotName
    });
  }

  function validateScreenshotWithMenu(done: DoneFn, screenshotName: string) {
    const input = element(by.css('textarea'));
    input.value = 'r';
    input.click();

    browser.actions().sendKeys('r').perform();

    browser.wait(() => {
      return browser.isElementPresent(
        element(by.css('.sky-autocomplete-results'))
      );
    });

    validateScreenshot(done, screenshotName);
  }

  beforeEach(() => {
    SkyHostBrowser.get('visual/lookup');
  });

  describe('(lg screens)', () => {
    beforeEach(() => {
      SkyHostBrowser.setWindowBreakpoint('lg');
    });

    it('should match previous lookup screenshot', (done) => {
      validateScreenshot(done, 'lookup');
    });

    it('should match previous lookup w/ menu screenshot', (done) => {
      validateScreenshotWithMenu(done, 'lookup-w-menu');
    });

    it('should match previous disabled lookup screenshot', (done) => {
      const btn = element(by.css('#btn-disable-lookup'));
      btn.click();

      validateScreenshot(done, 'lookup-disabled');
    });
  });

  describe('(xs screens)', () => {
    beforeEach(() => {
      SkyHostBrowser.setWindowBreakpoint('xs');
    });

    it('should match previous lookup screenshot', (done) => {
      validateScreenshot(done, 'lookup-xs');
    });

    it('should match previous lookup w/ menu screenshot', (done) => {
      validateScreenshotWithMenu(done, 'lookup-w-menu-xs');
    });
  });
});
