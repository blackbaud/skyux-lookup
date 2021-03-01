import {
  browser,
  by,
  element,
  ExpectedConditions
} from 'protractor';

import {
  expect,
  SkyHostBrowser,
  SkyVisualThemeSelector
} from '@skyux-sdk/e2e';

describe('Lookup component', () => {
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

  function validateScreenshot(done: DoneFn, screenshotName: string): void {
    expect('#lookup-visual').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(screenshotName)
    });
  }

  async function validateScreenshotWithMenu(done: DoneFn, screenshotName: string): Promise<void> {
    const input = element(by.css('textarea'));
    input.value = 'r';
    await input.click();

    await browser.actions().sendKeys('r').perform();

    await browser.wait(
      ExpectedConditions.presenceOf(element(by.css('.sky-autocomplete-results'))),
      1200,
      'Autocomplete results dropdown took too long to appear.'
    );

    validateScreenshot(done, screenshotName);
  }

  function validateSingleModeScreenshot(done: DoneFn, screenshotName: string): void {
    expect('#lookup-single-visual').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(screenshotName)
    });
  }

  function runTests(): void {
    describe('(lg screens)', () => {
      beforeEach(async () => {
        await SkyHostBrowser.setWindowBreakpoint('lg');
      });

      it('should match previous lookup screenshot', (done) => {
        validateScreenshot(done, 'lookup');
      });

      it('should match previous lookup w/ menu screenshot', async (done) => {
        await validateScreenshotWithMenu(done, 'lookup-w-menu');
      });

      it('should match previous disabled lookup screenshot', async (done) => {
        const btn = element(by.css('#btn-disable-lookup'));
        await btn.click();

        validateScreenshot(done, 'lookup-disabled');
      });

      it('should match previous lookup single mode screenshot', (done) => {
        validateSingleModeScreenshot(done, 'lookup-single-mode');
      });
    });

    describe('(xs screens)', () => {
      beforeEach(() => {
        SkyHostBrowser.setWindowBreakpoint('xs');
      });

      it('should match previous lookup screenshot', (done) => {
        validateScreenshot(done, 'lookup-xs');
      });

      it('should match previous lookup w/ menu screenshot', async (done) => {
        await validateScreenshotWithMenu(done, 'lookup-w-menu-xs');
      });

      it('should match previous lookup single mode screenshot', (done) => {
        validateSingleModeScreenshot(done, 'lookup-single-mode-xs');
      });
    });
  }

  beforeEach(async () => {
    await SkyHostBrowser.get('visual/lookup');
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
