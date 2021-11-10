import { expect, SkyHostBrowser, SkyVisualThemeSelector } from '@skyux-sdk/e2e';

import { browser, by, element, protractor } from 'protractor';

describe('Country field', () => {
  let currentTheme: string;
  let currentThemeMode: string;

  async function selectTheme(theme: string, mode: string): Promise<void> {
    currentTheme = theme;
    currentThemeMode = mode;

    return SkyVisualThemeSelector.selectTheme(theme, mode);
  }

  function getScreenshotName(name: string): string {
    if (currentTheme) {
      name += '-' + currentTheme;
    }

    if (currentThemeMode) {
      name += '-' + currentThemeMode;
    }

    return name;
  }

  async function selectCountryField(): Promise<void> {
    const input = element(
      by.css('#screenshot-country-field-populated textarea')
    );
    input.value = '';
    await input.click();
  }

  async function clearCountryField(): Promise<void> {
    await selectCountryField();

    await browser.actions().doubleClick().perform();
    // await browser.actions().sendKeys(protractor.Key.BACK_SPACE).perform();

    await element(by.css('body')).click();
  }

  function runTests(): void {
    it('should match previous screenshot with no selection', async (done) => {
      expect('#screenshot-country-field-empty').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('country-field-empty'),
        }
      );
    });

    it('should match previous screenshot with no selection (xs screen)', async (done) => {
      await SkyHostBrowser.setWindowBreakpoint('xs');

      expect('#screenshot-country-field-empty').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('country-field-empty-xs'),
        }
      );
    });

    it('should match previous screenshot with a selection', async (done) => {
      expect('#screenshot-country-field-populated').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('country-field-populated'),
        }
      );
    });

    it('should match previous screenshot with a selection (xs screen)', async (done) => {
      await SkyHostBrowser.setWindowBreakpoint('xs');

      expect('#screenshot-country-field-populated').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('country-field-populated-xs'),
        }
      );
    });

    it('should match previous screenshot with an error', async (done) => {
      await clearCountryField();

      expect('#screenshot-country-field-populated').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('country-field-error'),
        }
      );
    });

    it('should match previous screenshot with an error (xs screen)', async (done) => {
      await clearCountryField();
      await SkyHostBrowser.setWindowBreakpoint('xs');

      expect('#screenshot-country-field-populated').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('country-field-error-xs'),
        }
      );
    });

    it('should match previous screenshot while selected', async (done) => {
      await selectCountryField();

      expect('#screenshot-country-field-populated').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('country-field-selected'),
        }
      );
    });

    it('should match previous screenshot while selected (xs screen)', async (done) => {
      await selectCountryField();
      await SkyHostBrowser.setWindowBreakpoint('xs');

      expect('#screenshot-country-field-populated').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('country-field-selected-xs'),
        }
      );
    });

    it('should match previous screenshot while disabled and empty', async (done) => {
      await element(by.css('#disable-toggle')).click();

      expect('#screenshot-country-field-empty').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('country-field-empty-disabled'),
        }
      );
    });

    it('should match previous screenshot while disabled and empty (xs screen)', async (done) => {
      await element(by.css('#disable-toggle')).click();
      await SkyHostBrowser.setWindowBreakpoint('xs');

      expect('#screenshot-country-field-empty').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('country-field-empty-disabled-xs'),
        }
      );
    });

    it('should match previous screenshot while disabled and populated', async (done) => {
      await element(by.css('#disable-toggle')).click();

      expect('#screenshot-country-field-populated').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName('country-field-populated-disabled'),
        }
      );
    });

    it('should match previous screenshot while disabled and populated (xs screen)', async (done) => {
      await element(by.css('#disable-toggle')).click();
      await SkyHostBrowser.setWindowBreakpoint('xs');

      expect('#screenshot-country-field-populated').toMatchBaselineScreenshot(
        done,
        {
          screenshotName: getScreenshotName(
            'country-field-populated-disabled-xs'
          ),
        }
      );
    });

    // Input box
    it('should match previous screenshot while in an input box', async (done) => {
      await SkyHostBrowser.scrollTo(
        '#screenshot-country-field-empty-input-box'
      );

      expect(
        '#screenshot-country-field-empty-input-box'
      ).toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('country-field-empty-input-box'),
      });
    });

    it('should match previous screenshot while in an input box and disabled and empty', async (done) => {
      await SkyHostBrowser.scrollTo(
        '#screenshot-country-field-empty-input-box'
      );
      await element(by.css('#disable-toggle')).click();

      expect(
        '#screenshot-country-field-empty-input-box'
      ).toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName(
          'country-field-empty-input-box-disabled'
        ),
      });
    });

    // Input box no label
    it('should match previous screenshot while in an input box with no label', async (done) => {
      await SkyHostBrowser.scrollTo(
        '#screenshot-country-field-populated-input-box'
      );

      expect(
        '#screenshot-country-field-populated-input-box'
      ).toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName('country-field-populated-input-box'),
      });
    });

    it('should match previous screenshot while in an input box and disabled and empty', async (done) => {
      await SkyHostBrowser.scrollTo(
        '#screenshot-country-field-populated-input-box'
      );
      await element(by.css('#disable-toggle')).click();

      expect(
        '#screenshot-country-field-populated-input-box'
      ).toMatchBaselineScreenshot(done, {
        screenshotName: getScreenshotName(
          'country-field-populated-input-box-disabled'
        ),
      });
    });
  }

  beforeEach(async () => {
    currentTheme = undefined;
    currentThemeMode = undefined;

    await SkyHostBrowser.get('visual/country-field');
    await SkyHostBrowser.setWindowBreakpoint('lg');
  });

  runTests();

  describe('when modern theme', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'light');
    });

    runTests();
  });

  describe('when modern theme in dark mode', () => {
    beforeEach(async () => {
      await selectTheme('modern', 'dark');
    });

    runTests();
  });
});
