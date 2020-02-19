import {
  by,
  element
} from 'protractor';

import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

describe('search component', () => {
  function validateScreenshot(done: DoneFn, screenshotName: string) {
    expect('#search-visual').toMatchBaselineScreenshot(done, {
      screenshotName
    });
  }

  beforeEach(() => {
    SkyHostBrowser.get('visual/search');
  });

  describe('(lg screens)', () => {
    beforeEach(() => {
      SkyHostBrowser.setWindowBreakpoint('lg');
    });

    it('should match the baseline search screenshot', (done) => {
      validateScreenshot(done, 'search');
    });
  });

  describe('(xs screens)', () => {
    beforeEach(() => {
      SkyHostBrowser.setWindowBreakpoint('xs');
    });

    it('should match the baseline search screenshot on small screens', (done) => {
      validateScreenshot(done, 'search-xs');
    });

    it(
      'should match the baseline search screenshot on small screens when dismissible input is shown',
      (done) => {
        element(by.css('.sky-search-btn-open')).click();
        validateScreenshot(done, 'search-dismissible-xs');
      }
    );

    it(
      'should match the baseline search screenshot on small screens when search is applied',
      (done) => {
        element(by.css('.sky-search-btn-open')).click();
        element(by.css('.sky-search-input')).sendKeys('Value');
        element(by.css('.sky-search-btn-apply')).click();

        validateScreenshot(done, 'search-applied-xs');
      }
    );

    it('should match the baseline screenshot on small screens when search is applied and dismissed',
      (done) => {
        element(by.css('.sky-search-btn-open')).click();
        element(by.css('.sky-search-input')).sendKeys('Value');
        element(by.css('.sky-search-btn-apply')).click();
        element(by.css('.sky-search-btn-dismiss')).click();

        validateScreenshot(done, 'search-applied-dismissed-xs');
    });
  });
});
