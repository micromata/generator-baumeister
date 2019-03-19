# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.0.1](https://github.com/micromata/generator-baumeister/compare/4.0.0...4.0.1) (2019-03-19)


### Bug Fixes

* **baumeister:** Add contents of bundleCSS to vendor CSS bundle ([ff69167](https://github.com/micromata/generator-baumeister/commit/ff69167)), closes [micromata/baumeister#272](https://github.com/micromata/baumeister/issues/272)


### Reverts

* fix(baumeister): Initially lint files with npm start ([3b16011](https://github.com/micromata/generator-baumeister/commit/3b16011))



# [4.0.0](https://github.com/micromata/generator-baumeister/compare/3.1.0...4.0.0) (2019-02-20)


### Bug Fixes

* **baumeister:** Add missing dev dependency ([c0b89a9](https://github.com/micromata/generator-baumeister/commit/c0b89a9))
* **baumeister:** Fix linting errors introduced by updating ESLint, plugins and configs ([f38ea91](https://github.com/micromata/generator-baumeister/commit/f38ea91))
* **baumeister:** Initially lint files with npm start ([19e2e83](https://github.com/micromata/generator-baumeister/commit/19e2e83))
* **baumeister:** Loading images via webpack ([ff0b206](https://github.com/micromata/generator-baumeister/commit/ff0b206))
* **baumeister:** Resolve error running tests on Node 6 ([68744fe](https://github.com/micromata/generator-baumeister/commit/68744fe))
* **baumeister:** Update webpack and webpack-cli to fix build errors ([c820435](https://github.com/micromata/generator-baumeister/commit/c820435)), closes [#69](https://github.com/micromata/generator-baumeister/issues/69)
* **generator:** Add templates directory to lint-staged export path ([82f7f84](https://github.com/micromata/generator-baumeister/commit/82f7f84))


### Features

* **baumeister:** Auto format code using prettier as pre-commit hook ([6ea3dbf](https://github.com/micromata/generator-baumeister/commit/6ea3dbf))
* **baumeister:** Enable to define baumeister config in package.json ([fcfdc6c](https://github.com/micromata/generator-baumeister/commit/fcfdc6c))
* **baumeister:** Move tooling configs to package.json ([68f31d8](https://github.com/micromata/generator-baumeister/commit/68f31d8)), closes [#270](https://github.com/micromata/generator-baumeister/issues/270)
* **baumeister:** Update ESLint, plugins and shared configs to their latest versions ([3c6be02](https://github.com/micromata/generator-baumeister/commit/3c6be02))
* **baumeister:** Update husky to v1.x.x ([4f35c94](https://github.com/micromata/generator-baumeister/commit/4f35c94))
* **baumeister:** Update Jest to v24.x.x and Babel to v7.x.x ([7ac9da2](https://github.com/micromata/generator-baumeister/commit/7ac9da2))
* **baumeister:** Update production dependencies ([4a54e3c](https://github.com/micromata/generator-baumeister/commit/4a54e3c))


### BREAKING CHANGES

* **baumeister:** Auto formatting introduces a new dev dependency which requires Node.JS `>= 8.6`

We are using [prettier](https://prettier.io) to format JavaScript, JSON and SCSS files automatically before you commit your files to Git via a pre-commit hook.

The prettier settings are defined in `.prettierrc` in the project root. In case prettier is to opinated for you or you don’t want Prettier to change your files without the chance to review the changes you just have to delete the pre-commit hook with in the `package.json`:

```json
"husky": {
  "hooks": {
    "post-merge": "npm install",
    "pre-commit": "lint-staged"
  }
}
```

But we totally recommend you to give this workflow a chance, because it’s just one more thing you don’t have to care about.
* **baumeister:** Since the update to Husky v1.x.x you need to update the husky config which can be autmated by running `./node_modules/.bin/husky-upgrade`. See <https://github.com/typicode/husky#upgrading-from-014> for details.
* **baumeister:** The updates of ESLint, plugins and shared configs to their latest versions might break your build since new versions have introduced new rules which might introduce linting errors in your code base.

Tip: Run `npm run eslint:fix` to see which errors are autofixable. And remenber to turn off rules in /.eslintrc.json in case you find them too opinionated.



<a name="3.1.0"></a>
# [3.1.0](https://github.com/micromata/generator-baumeister/compare/3.0.0...3.1.0) (2018-05-03)


### Bug Fixes

* bring back object-rest-spread babel plugin for client code ([6792fb8](https://github.com/micromata/generator-baumeister/commit/6792fb8))
* Linting error caused by updating eslint-config-xo ([ac9b3a8](https://github.com/micromata/generator-baumeister/commit/ac9b3a8))


### Features

* Add interactive menu to list and run the most important scripts ([6e97c48](https://github.com/micromata/generator-baumeister/commit/6e97c48))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/micromata/generator-baumeister/compare/3.0.0-beta.1...3.0.0) (2018-04-04)


### Code Refactoring

* **scripts:** serve build via `npm run build:serve` ([496a15b](https://github.com/micromata/generator-baumeister/commit/496a15b))


### Features

* add PRODUCTION constant to ESLint config ([fbc804b](https://github.com/micromata/generator-baumeister/commit/fbc804b))
* first class support for React SPAs ([2f00fb4](https://github.com/micromata/generator-baumeister/commit/2f00fb4))
* improve the cacheability of the vendor bundle ([d9b60e4](https://github.com/micromata/generator-baumeister/commit/d9b60e4))
* reduce noise in terminal (especially in watch mode) ([46aea0b](https://github.com/micromata/generator-baumeister/commit/46aea0b))
* setup Babel plugin transform-imports ([b779eef](https://github.com/micromata/generator-baumeister/commit/b779eef))
* setup tree shaking ([b490094](https://github.com/micromata/generator-baumeister/commit/b490094))


### BREAKING CHANGES

* **scripts:** Changed the npm script name for serving the dist directory from `npm run build:check ` to `npm run build:serve`
* The webpack runtime has moved into a separate file. Therefore you need to add a reference to that file into your HTML / Handlebars file(s) before the vendor bundle:
  
  ```html
  <!-- webpack runtime JS -->
  @@runtime.js
  
  <!-- Vendor JS -->
  @@vendor.js
  
  <!-- Own JS -->
  @@app.js
  ```
  
  See <https://developers.google.com/web/fundamentals/performance/webpack/use-long-term-caching#webpack_runtime_code> for details about the why.



<a name="3.0.0-beta.1"></a>
# [3.0.0-beta.1](https://github.com/micromata/generator-baumeister/compare/3.0.0-beta.0...3.0.0-beta.1) (2018-03-22)


### Bug Fixes

* Open webpack dev server with --host flag ([1ae864e](https://github.com/micromata/generator-baumeister/commit/1ae864e))
* Referencing fonts from within Sass files ([9cd84e9](https://github.com/micromata/generator-baumeister/commit/9cd84e9)), closes [micromata/baumeister#236](https://github.com/micromata/baumeister/issues/236)


### Features

* Dynamically import and lazy load polyfills ([ef5f6b5](https://github.com/micromata/generator-baumeister/commit/ef5f6b5)), closes [micromata/baumeister#235](https://github.com/micromata/baumeister/issues/235)



<a name="3.0.0-beta.0"></a>
# [3.0.0-beta.0](https://github.com/micromata/generator-baumeister/compare/2.0.1...3.0.0-beta.0) (2018-03-18)


### Code Refactoring

* **baumeister.json:** Rename properties related to vendor files ([a594563](https://github.com/micromata/generator-baumeister/commit/a594563))


### Features

* remove Yarn lockfiles 👋🏻 ([b6f1fbf](https://github.com/micromata/generator-baumeister/commit/b6f1fbf))
* **eslint:** Simplify setup and include two additional plugins ([f039c24](https://github.com/micromata/generator-baumeister/commit/f039c24))
* Replace Gulp with webpack (and npm scripts) ([c6116ad](https://github.com/micromata/generator-baumeister/commit/c6116ad))
* Upgrade to Bootstrap 4 ([c7b4264](https://github.com/micromata/generator-baumeister/commit/c7b4264))


### BREAKING CHANGES

* 1. Gulp and all the tasks are gone. But most of the npm scripts still do what they did before. Here are the main scripts needed for developing and building your project.

| Command                 | Description |
| ----------------------- | --- |
| `npm start`             | *Builds for development, starts a webserver, watches files for changes, rebuilds incremental and reloads your browser.* |
| `npm test`              | *Lints your JavaScript files and runs unit test via the Jest CLI.* |
| `npm run test:watch`    | *Runs unit test with Jests watch option.* |
| `npm run build`         | *Builds for production to `dist` directory.* |
| `npm run build:check`   | *Starts a static fileserver serving the `dist` directory.* |
| `npm run build:analyze` | *Starts »webpack bundle analyzer« to visualize size of webpack output files* |

See package.json scripts section for all available scripts.

2. The polyfills bundle is gone and the references to the bundles in default.hbs respectively the HTML files has changed to:
<!-- Bundled vendor CSS files -->
@@vendor.css

<!-- Our compiled and merged Sass files -->
@@app.css

<!-- Vendor JS -->
@@vendor.js

<!-- Own JS -->
@@app.js

3. We switched from using UnCSS to PurifyCSS for remo0ving unused CSS.
Due to the concept of webpack we only generate one CSS bundle. PurifyCSS is turned off by default.

To activate PurifyCSS set the `usePurifyCSS` option in within `baumeister.json` to `true`.
In addition you can define a PurifyCSS `whitelist` defining an array of selectors that should not be removed.
* **eslint:** This adds [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) and the [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import) which might introduce new linting errors. You might want to turn off rules in `/.eslintrc.json` in case you find them too opinionated.
* **baumeister.json:** The properties `bundleCSS` and `includeStaticFiles` in baumeister.json are moved to `vendor.bundleCSS` and `vendor.includeStaticFiles`. You have to adapt these changes in case you have added dependencies via these properties.
* See [Bootstrap v4 migration guide](https://getbootstrap.com/docs/4.0/migration/) to read about the most notable as well as breaking changes.



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
	  > * **bundling:** Replace Browserify with webpack ([eb96f75](https://github.com/micromata/baumeister/commit/eb96f75)), closes [#209](https://github.com/micromata/baumeister/issues/209) [#211](https://github.com/micromata/baumeister/issues/211)
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
