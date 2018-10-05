import {
  by,
  element
} from 'protractor';

import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

describe('search component', () => {
  function validateScreenshot(done: DoneFn) {
    expect('#search-visual').toMatchBaselineScreenshot(done);
  }

  beforeEach(() => {
    SkyHostBrowser.get('visual/search');
  });

  describe('(lg screens)', () => {
    beforeEach(() => {
      SkyHostBrowser.setWindowBreakpoint('lg');
    });

    it('should match the baseline search screenshot', (done) => {
      validateScreenshot(done);
    });
  });

  describe('(xs screens)', () => {
    beforeEach(() => {
      SkyHostBrowser.setWindowBreakpoint('xs');
    });

    it('should match the baseline search screenshot on small screens', (done) => {
      validateScreenshot(done);
    });

    it(
      'should match the baseline search screenshot on small screens when dismissable input is shown',
      (done) => {
        element(by.css('.sky-search-btn-open')).click();
        validateScreenshot(done);
      }
    );

    it(
      'should match the baseline search screenshot on small screens when search is applied',
      (done) => {
        element(by.css('.sky-search-btn-open')).click();
        element(by.css('.sky-search-input')).sendKeys('Value');
        element(by.css('.sky-search-btn-apply')).click();

        validateScreenshot(done);
      }
    );

    it('should match the baseline screenshot on small screens when search is applied and dismissed',
      (done) => {
        element(by.css('.sky-search-btn-open')).click();
        element(by.css('.sky-search-input')).sendKeys('Value');
        element(by.css('.sky-search-btn-apply')).click();
        element(by.css('.sky-search-btn-dismiss')).click();

        validateScreenshot(done);
    });
  });
});
