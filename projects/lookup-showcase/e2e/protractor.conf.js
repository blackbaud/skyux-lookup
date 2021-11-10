// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
/// const { browser } = require('protractor');
const browserstack = require('browserstack-local');

const id = 'skyux-spa-' + new Date().getTime();

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: ['./src/**/*.e2e-spec.ts'],
  // capabilities: {
  //   browserName: 'chrome',
  //   chromeOptions: {
  //     args: [
  //       '--disable-dev-shm-usage',
  //       '--disable-extensions',
  //       '--disable-gpu',
  //       '--headless',
  //       '--ignore-certificate-errors',
  //       '--no-sandbox',
  //       '--start-maximized',
  //       '--window-size=1000,800',
  //     ],
  //   },
  // },
  // directConnect: true,
  SELENIUM_PROMISE_MANAGER: false,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 3000000,
    print: function () {},
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json'),
    });
    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: StacktraceOption.PRETTY,
        },
      })
    );
  },

  // Browserstack config.
  browserstackUser: process.env.BROWSERSTACK_USERNAME,
  browserstackKey: process.env.BROWSERSTACK_ACCESS_KEY,
  capabilities: {
    chromeOptions: {
      args: [
        'incognito',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
        '--headless',
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--start-maximized',
        '--window-size=1000,800',
      ],
    },

    os: 'Windows',
    os_version: '10',
    browserName: 'Chrome',
    browser_version: 'latest',
    'browserstack.local': 'true',
    'browserstack.localIdentifier': id,
    'browserstack.debug': 'true',
    'browserstack.console': 'verbose',
    'browserstack.networkLogs': 'true',
    'browserstack.selenium_version': '3.6.0',
    'browserstack.use_w3c': 'false',
  },
  beforeLaunch: function () {
    console.log('Connecting local');
    return new Promise(function (resolve, reject) {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start(
        {
          key: exports.config['browserstackKey'],
          localIdentifier: id,
        },
        function (error) {
          if (error) return reject(error);
          console.log('Connected. Now testing...');

          resolve();
        }
      );
    });
  },

  // Code to stop browserstack local after end of test
  afterLaunch: function () {
    return new Promise(function (resolve) {
      exports.bs_local.stop(resolve);
    });
  },
};
