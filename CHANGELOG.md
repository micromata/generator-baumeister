# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.0.1"></a>
## [2.0.1](https://github.com/micromata/generator-baumeister/compare/2.0.0...2.0.1) (2018-02-12)


### Bug Fixes

* adapt breaking changes of updated dev dependencies ([874b294](https://github.com/micromata/generator-baumeister/commit/874b294))
* copy additional directories in src/assets to build directories ([0af86b4](https://github.com/micromata/generator-baumeister/commit/0af86b4))
* update dependencies of generated project ([d8a9780](https://github.com/micromata/generator-baumeister/commit/d8a9780))
* Update dependencies of the generator ([d1e1d41](https://github.com/micromata/generator-baumeister/commit/d1e1d41))
* update dev dependencies of the generated project ([62067f7](https://github.com/micromata/generator-baumeister/commit/62067f7))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/micromata/generator-baumeister/compare/1.1.1...2.0.0) (2018-01-09)


### Bug Fixes

* Update dependencies of the generator ([83a3baf](https://github.com/micromata/generator-baumeister/commit/83a3baf))
* **prompting:** Fix broken prompt for theme name 🙈 ([482ecae](https://github.com/micromata/generator-baumeister/commit/482ecae))
* **readme:** Print the chosen license in the README ([cbf61ac](https://github.com/micromata/generator-baumeister/commit/cbf61ac))

### Features

* **prompting:** Remove prompt to rename output directory ([4809822](https://github.com/micromata/generator-baumeister/commit/4809822))


### Chores

* Adapt changes from Baumeister 2.0.0. ([ee4f731](https://github.com/micromata/generator-baumeister/commit/ee4f731))

  * > #### Bug Fixes
	> * update dependencies ([2722663](https://github.com/micromata/baumeister/commit/2722663))
	> * update dependencies ([#199](https://github.com/micromata/baumeister/issues/199)) ([9d41b6d](https://github.com/micromata/baumeister/commit/9d41b6d))
	> * **config:** prevent error if `includeStaticFiles` is empty ([3ce7eb5](https://github.com/micromata/baumeister/commit/3ce7eb5)), closes [#215](https://github.com/micromata/baumeister/issues/215)
	> * **linting:** fix linting errors introduced with eslint-config-xo ([389e07b](https://github.com/micromata/baumeister/commit/389e07b))
	> * update dev dependencies ([d96c53e](https://github.com/micromata/baumeister/commit/d96c53e))
	> * update dev dependencies ([b072aa8](https://github.com/micromata/baumeister/commit/b072aa8))
	> * **linting:** fix stylelint errors ([62a4087](https://github.com/micromata/baumeister/commit/62a4087))
	> * **settings:** revert generateBanners setting to false ([68eebf5](https://github.com/micromata/baumeister/commit/68eebf5))
  * > #### Code Refactoring
	  > * **bundling:** Replace Browserify with Webpack ([eb96f75](https://github.com/micromata/baumeister/commit/eb96f75)), closes [#209](https://github.com/micromata/baumeister/issues/209) [#211](https://github.com/micromata/baumeister/issues/211)
  * > #### Features
    > * **linting:** Add eslint rules to ensure consistent filenames ([#201](https://github.com/micromata/baumeister/issues/201)) ([82e24a8](https://github.com/micromata/baumeister/commit/82e24a8)), closes [#197](https://github.com/micromata/baumeister/issues/197)
    > * **settings:** Move settings to baumeister.json ([c4029a4](https://github.com/micromata/baumeister/commit/c4029a4)), closes [#212](https://github.com/micromata/baumeister/issues/212) [#213](https://github.com/micromata/baumeister/issues/213)
    > * **transpiling:** Transform `async/await` using regenerator ([91cd23c](https://github.com/micromata/baumeister/commit/91cd23c)), closes [#207](https://github.com/micromata/baumeister/issues/207)

### BREAKING CHANGES

#### Yeoman Generator

* **prompting:** You aren’t able to customize the name of the `dist` directory while scaffolding your app. You can still customize it after scaffolding by changing the directory in `/gulp/config.js`.

#### Generated projects via Baumeister 2.0.0

* **linting:** The new major version of `stylelint-config-standard` introduces
some new rules which might break your build. Therefore you might
need to adapt your code or disable unwanted rules in `.stylelintrc.json`.
* **bundling:** The bundles are renamed (and partly removed) to: `app/polyfills.bundle.js`, `app/vendor.bundle.js` and `app/app.bundle.js` and must be included via script tags in that order. See [default.hbs](https://github.com/micromata/Baumeister/blob/e6346738f472ee57a204dbbf400f29924965abea/src/handlebars/layouts/default.hbs#L48-L61).
* **settings:** Settings moved from `package.json` to the new `baumeister.json` config file in the project root. In addition the two boolean settings `useHandlebars` and `generateBanners` from `gulp/config.js` are also exposed to the `baumeister.json`.
* **linting:** `eslint-plugin-filenames` will cause linting errors in case you already have JavaScript files with filenames written in camelCase. You have to rename those files or change/disable the rule `filenames/match-exported` in `.eslintrc.json` depending on your preference.

<a name="1.1.1"></a>
## [1.1.1](https://github.com/micromata/generator-baumeister/compare/1.1.0...1.1.1) (2017-10-24)


### Bug Fixes

* Update dependencies of the generator ([4b538a2](https://github.com/micromata/generator-baumeister/commit/4b538a2))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/micromata/generator-baumeister/compare/1.0.3...1.1.0) (2017-07-31)


### Bug Fixes

* **generated:** Bump version number in package-lock.json as well ([121eaec](https://github.com/micromata/generator-baumeister/commit/121eaec))


### Features

* **generated:** Set polyfills via core-js ([#194](https://github.com/micromata/generator-baumeister/issues/194)) ([cef5ec7](https://github.com/micromata/generator-baumeister/commit/cef5ec7))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/micromata/generator-baumeister/compare/1.0.2...1.0.3) (2017-07-29)


### Bug Fixes

* adapt changes from Baumeister 1.0.2 ([de51ed4](https://github.com/micromata/generator-baumeister/commit/de51ed4))
* Automatically install with npm if Yarn isn’t available ([ddda515](https://github.com/micromata/generator-baumeister/commit/ddda515))
* Update dependencies of the generator ([5139557](https://github.com/micromata/generator-baumeister/commit/5139557))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/micromata/generator-baumeister/compare/1.0.1...1.0.2) (2017-06-25)


### Bug Fixes

* **gulp:** Consistent use of settings variables ([d7b9166](https://github.com/micromata/generator-baumeister/commit/d7b9166))
* Follow conventional commits specs in release commits ([44eee52](https://github.com/micromata/generator-baumeister/commit/44eee52))
* Remove Grunt and replace Mocha with Jest ([e07c752](https://github.com/micromata/generator-baumeister/commit/e07c752))



# Changelog

## Version 1.0.1 (2017-06-19)

- 6aec417 - 2017-06-19: fix: Remove package-lock.json from templates
- 9496b8b - 2017-06-18: chore: Update Travis build notification for new gitter room
- e7e6514 - 2017-06-18: chore: Readme tweaks


# Changelog
