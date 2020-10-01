import {
  by,
  element
} from 'protractor';

import {
  expect,
  SkyHostBrowser,
  SkyVisualThemeSelector
} from '@skyux-sdk/e2e';

describe('search component', () => {
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

  function validateScreenshot(done: DoneFn, screenshotName: string) {
    expect('#search-visual').toMatchBaselineScreenshot(done, {
      screenshotName: getScreenshotName(screenshotName)
    });
  }

  async function clickElement(selector: string): Promise<void> {
    await element(by.css(selector)).click();
  }

  async function openSearch(): Promise<void> {
    await clickElement('.sky-search-btn-open');
    await SkyHostBrowser.moveCursorOffScreen();
  }

  async function applySearchText(): Promise<void> {
    await element(by.css('.sky-search-input')).sendKeys('Value');
    await clickElement('.sky-search-btn-apply');
    await SkyHostBrowser.moveCursorOffScreen();
  }

  async function dismissSearch(): Promise<void> {
    await clickElement('.sky-search-btn-dismiss');
    await SkyHostBrowser.moveCursorOffScreen();
  }

  function runTests(): void {
    describe('(lg screens)', () => {
      beforeEach(() => {
        SkyHostBrowser.setWindowBreakpoint('lg');
      });

      it('should match the baseline search screenshot', (done) => {
        validateScreenshot(done, 'search');
      });
    });

    describe('(xs screens)', () => {
      beforeEach(async () => {
        await SkyHostBrowser.setWindowBreakpoint('xs');
      });

      it('should match the baseline search screenshot on small screens', (done) => {
        validateScreenshot(done, 'search-xs');
      });

      it(
        'should match the baseline search screenshot on small screens when dismissible input is shown',
        async (done) => {
          await openSearch();

          validateScreenshot(done, 'search-dismissible-xs');
        }
      );

      it(
        'should match the baseline search screenshot on small screens when search is applied',
        async (done) => {
          await openSearch();
          await applySearchText();

          validateScreenshot(done, 'search-applied-xs');
        }
      );

      it('should match the baseline screenshot on small screens when search is applied and dismissed',
        async (done) => {
          await openSearch();
          await applySearchText();
          await dismissSearch();

          validateScreenshot(done, 'search-applied-dismissed-xs');
      });
    });
  }

  beforeEach(async () => {
    currentTheme = undefined;
    currentThemeMode = undefined;

    await SkyHostBrowser.get('visual/search');
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
