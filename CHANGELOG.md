# 3.6.0 (2020-05-21)

- Added the `supportedCountryISOs` input property to the country field component to limit the countries returned. [#89](https://github.com/blackbaud/skyux-lookup/pull/89)
- Fixed the autocomplete directive to prevent the browser's autofill from appearing. [#94](https://github.com/blackbaud/skyux-lookup/pull/94)

# 3.5.0 (2020-04-23)

- Added the ability to set the country field component's form value via an `iso2` country code. [#82](https://github.com/blackbaud/skyux-lookup/pull/82)

# 3.4.1 (2020-04-09)

- Fixed the **package.json** `peerDependencies` to require a minimum of `^@skyux/core@3.4.2`. [#76](https://github.com/blackbaud/skyux-lookup/pull/76) (Thanks [@jeffbdye](https://github.com/jeffbdye)!)

# 3.4.0 (2020-04-08)

- Updated the autocomplete and lookup components to implement the affix and overlay services. [#74](https://github.com/blackbaud/skyux-lookup/pull/74)

# 3.3.4 (2020-03-23)

- Fixed the country field component to properly handle the first value change on a reactive form when the initial value is undefined. [#71](https://github.com/blackbaud/skyux-lookup/pull/71)

# 3.3.3 (2020-03-18)

- Fixed the `package.json` file to list `intl-tel-input` as a dependency and not a peer dependency.

# 3.3.2 (2020-03-16)

- Fixed the autocomplete component to highlight results after removing search text and after only one character is supplied. [#65](https://github.com/blackbaud/skyux-lookup/pull/65)
- Fixed the country field component to always fire the `selectedCountryChange` event when a country is selected. [#63](https://github.com/blackbaud/skyux-lookup/pull/63)
- Fixed the lookup component to validate required values on template-driven forms. [#64](https://github.com/blackbaud/skyux-lookup/pull/64)
- Fixed the search component to remain inside its container. [#61](https://github.com/blackbaud/skyux-lookup/pull/61)

# 3.3.1 (2020-03-11)

- Fixed the country field component to eliminate extra space below the component. [#59](https://github.com/blackbaud/skyux-lookup/pull/59)
- Fixed the country field component to recognize when it is placed within the phone field component. [#59](https://github.com/blackbaud/skyux-lookup/pull/59)
- Fixed the country field component to properly remove the flag from the input element when the form's value is cleared. [#59](https://github.com/blackbaud/skyux-lookup/pull/59)

# 3.3.0 (2020-03-10)

- Added the country field component. [#55](https://github.com/blackbaud/skyux-lookup/pull/55)

# 3.2.1 (2020-02-13)

- Fixed the autocomplete component to use the `Renderer2` service instead of the deprecated `Renderer` service. [#50](https://github.com/blackbaud/skyux-lookup/pull/50)

# 3.2.0 (2019-11-21)

- Added a "No results found" message to the autocomplete component for empty search responses. [#47](https://github.com/blackbaud/skyux-lookup/pull/47) (Thanks [@blackbaud-GavinNicol](https://github.com/blackbaud-GavinNicol)!)

# 3.1.2 (2019-11-11)

- Fixed the lookup component to properly represent the Angular form status `touched`. [#44](https://github.com/blackbaud/skyux-lookup/pull/44)

# 3.1.1 (2019-06-26)

- Fixed the search component to handle searches with no applied value. [#34](https://github.com/blackbaud/skyux-lookup/pull/34)

# 3.1.0 (2019-06-07)

- Added the ability to trigger responsive styles based on a parent component. [#21](https://github.com/blackbaud/skyux-lookup/pull/21)
- Fixed the search component to trim whitespace when search text is entered. [#31](https://github.com/blackbaud/skyux-lookup/pull/31) (Thanks @Blackbaud-JackMcElhinney)

# 3.0.3 (2019-05-28)

- Fixed the search component to use the correct visual styles when focused. [#27](https://github.com/blackbaud/skyux-lookup/pull/27)

# 3.0.2 (2019-05-17)

- Fixed the autocomplete component to emit a `selectionChange` event when the input is cleared. [#22](https://github.com/blackbaud/skyux-lookup/issues/22)
- Fixed the autocomplete component to properly represent Angular form control statuses (dirty, pristine, etc.). [#20](https://github.com/blackbaud/skyux-lookup/issues/20)

# 3.0.1 (2019-02-11)

- Removed a reference to the deprecated `AnimationTransitionEvent` in favor of `AnimationEvent`. This allows the library to compile against later versions of Angular that have removed the deprecated type. [#13](https://github.com/blackbaud/skyux-lookup/pull/13)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.5 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#9](https://github.com/blackbaud/skyux-lookup/pull/9)

# 3.0.0-rc.4 (2018-11-14)

- Added the `debounceTime` input to the autocomplete component. [#8](https://github.com/blackbaud/skyux-lookup/pull/8)

# 3.0.0-rc.3 (2018-11-12)

- Fixed the autocomplete component to properly position the dropdown when inside a vertical tab form. [#2](https://github.com/blackbaud/skyux-lookup/pull/2)

# 3.0.0-rc.2 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#5](https://github.com/blackbaud/skyux-lookup/pull/5)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#3](https://github.com/blackbaud/skyux-lookup/pull/3)

# 3.0.0-rc.0 (2018-10-09)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-08)

- Initial alpha release.
