import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

import {
  browser,
  by,
  element,
  ExpectedConditions
} from 'protractor';

describe('Autocomplete', () => {
  beforeEach(() => {
    SkyHostBrowser.get('visual/autocomplete');
    SkyHostBrowser.setWindowBreakpoint('lg');
  });

  function activateDropdown(): void {
    const input = element(by.css('#favorite-color-reactive'));
    input.value = 'r';
    input.click();
    browser.actions().sendKeys('r').perform();

    browser.wait(
      ExpectedConditions.presenceOf(element(by.css('.sky-autocomplete-results'))),
      1200,
      'Autocomplete results dropdown took too long to appear.'
    );
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
    activateDropdown();
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-with-dropdown'
    });
  });

  it('should match previous screenshot with dropdown open (xs screen)', (done) => {
    SkyHostBrowser.setWindowBreakpoint('xs');
    activateDropdown();
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-with-dropdown-xs'
    });
  });

  it('should match previous screenshot while disabled', (done) => {
    element(by.css('#autocomplete-reactive-disable-button')).click();
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-disabled'
    });
  });

  it('should match previous screenshot while disabled (xs screen)', (done) => {
    SkyHostBrowser.setWindowBreakpoint('xs');
    element(by.css('#autocomplete-reactive-disable-button')).click();
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-disabled-xs'
    });
  });
});
