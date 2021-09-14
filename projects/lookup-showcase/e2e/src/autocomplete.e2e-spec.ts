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
  beforeEach(async () => {
    await SkyHostBrowser.get('visual/autocomplete');
    await SkyHostBrowser.setWindowBreakpoint('lg');
  });

  async function activateDropdown(): Promise<void> {
    const input = element(by.css('#favorite-color-reactive'));
    input.value = 'r';
    input.click();
    await browser.actions().sendKeys('r').perform();

    return browser.wait(
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

  it('should match previous screenshot with no dropdown (xs screen)', async (done) => {
    await SkyHostBrowser.setWindowBreakpoint('xs');
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-no-dropdown-xs'
    });
  });

  it('should match previous screenshot with dropdown open', async (done) => {
    await activateDropdown();
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-with-dropdown'
    });
  });

  it('should match previous screenshot with dropdown open (xs screen)', async (done) => {
    await SkyHostBrowser.setWindowBreakpoint('xs');
    await activateDropdown();
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-with-dropdown-xs'
    });
  });

  it('should match previous screenshot while disabled', async (done) => {
    await element(by.css('#autocomplete-reactive-disable-button')).click();
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-disabled'
    });
  });

  it('should match previous screenshot while disabled (xs screen)', async (done) => {
    await SkyHostBrowser.setWindowBreakpoint('xs');
    await element(by.css('#autocomplete-reactive-disable-button')).click();
    expect('#autocomplete-reactive').toMatchBaselineScreenshot(done, {
      screenshotName: 'autocomplete-disabled-xs'
    });
  });
});
