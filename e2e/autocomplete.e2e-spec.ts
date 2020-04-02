import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  browser,
  by,
  element
} from 'protractor';

describe('Autocomplete', () => {
  beforeEach(() => {
    SkyHostBrowser.get('visual/autocomplete');
    SkyHostBrowser.setWindowBreakpoint('lg');
  });

  function activateDropdown(done: DoneFn): void {
    const input = element(by.css('#favorite-color-reactive'));
    input.value = 'r';
    input.click();
    browser.actions().sendKeys('r').perform();

    browser.wait(() => {
      return browser.isElementPresent(
        element(by.css('.sky-autocomplete-results'))
      );
    });
  }

  it('should match previous screenshot with no dropdown', (done) => {
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-no-dropdown'
    });
  });

  it('should match previous screenshot with no dropdown (xs screen)', (done) => {
    SkyHostBrowser.setWindowBreakpoint('xs');
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-no-dropdown-xs'
    });
  });

  it('should match previous screenshot with dropdown open', (done) => {
    activateDropdown(done);
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-with-dropdown'
    });
  });

  it('should match previous screenshot with dropdown open (xs screen)', (done) => {
    SkyHostBrowser.setWindowBreakpoint('xs');
    activateDropdown(done);
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-with-dropdown-xs'
    });
  });
});
