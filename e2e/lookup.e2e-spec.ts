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
    SkyHostBrowser.scrollTo('#lookup-visual');
    expect('#lookup-visual').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(screenshotName)
    });
  }

  async function validateScreenshotWithMenu(done: DoneFn, screenshotName: string): Promise<void> {
    SkyHostBrowser.scrollTo('#lookup-visual');
    const input = element(by.css('#lookup-visual textarea'));
    input.value = 'r';
    await input.click();

    await input.sendKeys('r');

    await browser.wait(
      ExpectedConditions.presenceOf(element(by.css('.sky-autocomplete-results'))),
      1200,
      'Autocomplete results dropdown took too long to appear.'
    );

    validateScreenshot(done, screenshotName);
  }

  async function validateShowMoreModalScreenshot(done: DoneFn, screenshotName: string): Promise<void> {
    const input = element(by.css('#lookup-visual textarea'));
    input.value = 'r';
    await input.click();

    await browser.actions().sendKeys('r').perform();

    await browser.wait(
      ExpectedConditions.presenceOf(element(by.css('.sky-autocomplete-results'))),
      1200,
      'Autocomplete results dropdown took too long to appear.'
    );

    const showMoreButton = element(by.css('.sky-autocomplete-action-more'));
    showMoreButton.click();

    await browser.wait(
      ExpectedConditions.presenceOf(element(by.css('sky-modal'))),
      1200,
      'Show more modal took too long to appear.'
    );

    SkyHostBrowser.scrollTo('#show-more-modal-screenshot');
    expect('#show-more-modal-screenshot').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(screenshotName)
    });
  }

  function validateSingleModeScreenshot(done: DoneFn, screenshotName: string): void {
    SkyHostBrowser.scrollTo('#single-mode-info');
    expect('#lookup-single-visual').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(screenshotName)
    });
  }

  async function validateSingleModeScreenshotWithMenu(done: DoneFn, screenshotName: string): Promise<void> {
    await SkyHostBrowser.scrollTo('#single-mode-info');
    const input = element(by.css('#lookup-single-visual textarea'));
    const resetValueBtn = element(by.css('#btn-reset-value'));
    input.value = 'r';
    await resetValueBtn.click();
    await input.click();

    await input.sendKeys('r');

    await browser.wait(
      ExpectedConditions.presenceOf(element(by.css('.sky-autocomplete-results'))),
      1200,
      'Autocomplete results dropdown took too long to appear.'
    );

    validateSingleModeScreenshot(done, screenshotName);
  }

  async function validateSingleModeShowMoreModalScreenshot(done: DoneFn, screenshotName: string): Promise<void> {
    await SkyHostBrowser.scrollTo('#single-mode-info');
    const input = element(by.css('#lookup-single-visual textarea'));
    const resetValueBtn = element(by.css('#btn-reset-value'));
    input.value = 'r';
    await resetValueBtn.click();
    await input.click();

    await browser.actions().sendKeys('r').perform();

    await browser.wait(
      ExpectedConditions.presenceOf(element(by.css('.sky-autocomplete-results'))),
      1200,
      'Autocomplete results dropdown took too long to appear.'
    );

    const showMoreButton = element(by.css('.sky-autocomplete-action-more'));
    await showMoreButton.click();

    await browser.wait(
      ExpectedConditions.presenceOf(element(by.css('sky-modal'))),
      1200,
      'Show more modal took too long to appear.'
    );

    await SkyHostBrowser.scrollTo('#show-more-modal-screenshot');
    expect('#show-more-modal-screenshot').toMatchBaselineScreenshot(done, {
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

      it('should match previous lookup show more modal screenshot', async (done) => {
        validateShowMoreModalScreenshot(done, 'lookup-show-more');
      });

      it('should match previous lookup single mode screenshot', (done) => {
        validateSingleModeScreenshot(done, 'lookup-single-mode');
      });

      it('should match previous lookup single mode w/ menu screenshot', (done) => {
        validateSingleModeScreenshotWithMenu(done, 'lookup-single-mode-w-menu');
      });

      it('should match previous lookup single mode show more modal screenshot', async (done) => {
        validateSingleModeShowMoreModalScreenshot(done, 'lookup-single-mode-show-more');
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

      it('should match previous lookup show more modal screenshot', async (done) => {
        validateShowMoreModalScreenshot(done, 'lookup-show-more-xs');
      });

      it('should match previous lookup single mode screenshot', (done) => {
        validateSingleModeScreenshot(done, 'lookup-single-mode-xs');
      });

      it('should match previous lookup single mode w/ menu screenshot', (done) => {
        validateSingleModeScreenshotWithMenu(done, 'lookup-single-mode-w-menu-xs');
      });

      it('should match previous lookup show more modal screenshot', async (done) => {
        validateSingleModeShowMoreModalScreenshot(done, 'lookup-single-mode-show-more-xs');
      });
    });
  }

  let originalTimeout: number;

  beforeEach(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    await SkyHostBrowser.get('visual/lookup');
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
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
