'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const os = require('os');
const _s = require('underscore.string');
const should = require('should'); // eslint-disable-line no-unused-vars
const fs = require('fs');
const escapeStringRegexp = require('escape-string-regexp');
const chalk = require('chalk');
const helper = require('../app/promptingHelpers');

describe('Baumeister with default options', () => {
	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		projectType: 'staticSite',
		theme: 'My theme',
		authorName: 'My Name',
		authorMail: 'name@domain.com',
		authorUrl: 'http://www.foo.com',
		license: 'MIT',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banners: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'little'
	};

	beforeAll(() => {
		return (
			helpers
				.run(path.join(__dirname, '../app'))

				// Clear the directory and set it as the CWD
				.inDir(path.join(os.tmpdir(), './temp-test'))

				// Mock options passed in
				.withOptions({
					'skip-install': true
				})

				// Mock the prompt answers
				.withPrompts(prompts)

				.toPromise()
		);
	});

	it('should create files related to the build process', () => {
		assert.file([
			'build/config.js',
			'build/handlebars.js',
			'build/webpack.config.babel.js',
			'build/webpack/config.dev-server.js',
			'build/webpack/config.entry.js',
			'build/webpack/config.module.rules.js',
			'build/webpack/config.optimization.js',
			'build/webpack/config.output.js',
			'build/webpack/config.plugins.js',
			'build/webpack/config.stats.js',
			'build/webpack/helpers.js'
		]);
	});

	it('should have the default output paths within the build config', () => {
		const arg = [['build/config.js', new RegExp(escapeStringRegexp("prod: '../dist/'"), '')]];
		assert.fileContent(arg);
	});

	it('should not have historyApiFallback in dev server settings', () => {
		assert.noFileContent([['build/webpack/config.dev-server.js', /historyApiFallback: true,/]]);
	});

	it('should have `useHandlebars` set to `true` in baumeister.json', () => {
		assert.fileContent('baumeister.json', /"useHandlebars": true,/);
	});

	it('should have `generateBanners` set to `false` in baumeister.json', () => {
		assert.fileContent('baumeister.json', /"generateBanners": false,/);
	});

	it('should have the default ProvidePlugin settings in baumeister.json', () => {
		assert.fileContent([
			['baumeister.json', /"ProvidePlugin": {\n/],
			['baumeister.json', /"\$": "jquery",/],
			['baumeister.json', /"jQuery": "jquery"/]
		]);
	});

	it('should create package manager files', () => {
		assert.file(['package.json']);
	});

	it('should create dummy test file', () => {
		assert.file('src/app/__tests__/dummy-test.js');
	});

	it('should create dot files', () => {
		assert.file([
			'.editorconfig',
			'.gitattributes',
			'.gitignore',
			'.babelrc',
			'src/app/.babelrc',
			'.travis.yml',
			'.eslintrc.json',
			'.stylelintrc.json'
		]);
	});

	it('should not have React related plugins in .babelrc', () => {
		assert.noFileContent([
			['src/app/.babelrc', /transform-class-properties/],
			['src/app/.babelrc', /transform-react-jsx/]
		]);
	});

	it('should not have React related settings in .eslintrc', () => {
		assert.noFileContent([
			['.eslintrc.json', /"plugin:react\/recommended"/],
			['.eslintrc.json', /"plugins": \["react"],/],
			['.eslintrc.json', /"ecmaFeatures": {"jsx": true}/]
		]);
	});

	it('should have `/dist` directory in .gitignore', () => {
		assert.fileContent([['.gitignore', /dist/]]);
	});

	it('should create handlebars files', () => {
		assert.file([
			'src/index.hbs',
			'src/stickyFooter.hbs',
			'src/demoElements.hbs',
			'src/handlebars/layouts/default.hbs',
			'src/handlebars/helpers/add-year.js',
			'src/handlebars/partials/footer.hbs',
			'src/handlebars/partials/navbar.hbs'
		]);
	});

	it('should not create html files', () => {
		assert.noFile(['src/index.html', 'src/stickyFooter.html', 'src/demoElements.html']);
	});

	it('should create other project files', () => {
		assert.file([
			'README.md',
			'baumeister.json',
			'postcss.config.js',
			'humans.txt',
			'LICENSE',
			'CONTRIBUTING.md',
			'CHANGELOG.md',
			'CODE_OF_CONDUCT.md'
		]);
	});

	it('should create JS file ', () => {
		assert.file(['src/app/base/base.js', 'src/app/index.js', 'src/app/base/polyfills.js']);
	});

	it('should import Bootstrap in index.js', () => {
		assert.fileContent([['src/app/index.js', /import 'bootstrap';/]]);
	});

	it('should not use React in index.js', () => {
		assert.noFileContent([
			['src/app/index.js', /import React from 'react';/],
			['src/app/index.js', /import ReactDOM from 'react-dom';/],
			['src/app/index.js', /ReactDOM\.render/]
		]);
	});

	it('should create assets', () => {
		assert.file([
			'src/assets',
			'src/assets/fonts',
			'src/assets/img',
			'src/assets/scss/index.scss',
			'src/assets/scss/_print.scss',
			'src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_alerts.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_footer.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_mixins.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_scaffolding.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_testResponsiveHelpers.scss',
			'src/assets/scss/_variables.scss'
		]);
	});

	it('should import all Sass files within _' + _s.slugify(prompts.theme) + '.scss file', () => {
		assert.fileContent([
			['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /testResponsiveHelpers/],
			['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /alerts/],
			['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /footer/],
			['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /mixins/],
			['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /scaffolding/]
		]);
	});

	it("should import '_variables.scss' within 'index.scss' file", () => {
		assert.fileContent([['src/assets/scss/index.scss', /.\/variables/]]);
	});

	it('should have a valid package.json file', () => {
		JSON.parse(fs.readFileSync('package.json'));
	});

	it('should render project name and description in package.json', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.property('name', _s.slugify(prompts.projectName));
		packageJson.should.have.property('title', _s.titleize(prompts.projectName));
		packageJson.should.have.property('description', prompts.projectDescription);
	});

	describe('Dependencies', () => {
		it('should have jQuery and popper.js', () => {
			assert.fileContent([['package.json', /jquery/], ['package.json', /popper.js/]]);
		});

		it('should not have React and related dependencies', () => {
			assert.noFileContent([
				['package.json', /react/],
				['package.json', /react-dom/],
				['package.json', /prop-types/]
			]);
		});

		it('should not have React related dev dependencies', () => {
			assert.noFileContent([
				['package.json', /eslint-plugin-react/],
				['package.json', /babel-plugin-transform-react-jsx/],
				['package.json', /babel-plugin-transform-class-properties/]
			]);
		});
	});

	it('should render project name and description in README.md', () => {
		let regex = new RegExp(escapeStringRegexp(prompts.projectDescription), '');
		assert.fileContent('README.md', regex);
		regex = new RegExp(escapeStringRegexp(_s.titleize(prompts.projectName)), '');
		assert.fileContent('README.md', regex);
	});

	it('should render project name in HTML files', () => {
		const regex = new RegExp(escapeStringRegexp(_s.titleize(prompts.projectName)), '');
		assert.fileContent('src/handlebars/layouts/default.hbs', regex);
	});

	it('should render author name within the meta tags of HTML files', () => {
		const regex = new RegExp(
			escapeStringRegexp('<meta name="author" content="' + prompts.authorName + '">'),
			''
		);
		assert.fileContent('src/handlebars/layouts/default.hbs', regex);
	});

	it('should have authors name in package.json and LICENSE', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));
		const regex = new RegExp(escapeStringRegexp(prompts.authorName), '');

		packageJson.should.have.propertyByPath('author', 'name').eql(prompts.authorName);
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors email in package.json', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));

		packageJson.should.have.propertyByPath('author', 'email').eql(prompts.authorMail);
	});

	it('should have authors URL in package.json and LICENSE', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));
		const regex = new RegExp(escapeStringRegexp(prompts.authorUrl), '');

		packageJson.should.have.propertyByPath('author', 'url').eql(prompts.authorUrl);
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', () => {
		const regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''), ''); // eslint-disable-line no-implicit-coercion
		assert.fileContent('LICENSE', regex);
	});

	it('should have a MIT LICENSE', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));

		assert.fileContent(
			'LICENSE',
			/copy, modify, merge, publish, distribute, sublicense, and\/or sell/
		);
		packageJson.should.have.property('license', prompts.license);
	});

	it('should have the correct license in the README file', () => {
		assert.fileContent('README.md', /MIT license/);
	});

	it('should have the initial version number in package.json', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.property('version', prompts.initialVersion);
	});

	it('should have the homepage and repository in package.json', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));

		packageJson.should.have.property('homepage', prompts.projectHomepage);
		packageJson.should.have.propertyByPath('repository', 'type').eql(prompts.projectRepositoryType);
		packageJson.should.have.propertyByPath('repository', 'url').eql(prompts.projectRepository);
	});

	it('should have the issue tracker url in package.json', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.propertyByPath('bugs', 'url').eql(prompts.issueTracker);
	});
});

describe('Baumeister generating a single page app', () => {
	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		projectType: 'spa',
		theme: 'My theme',
		authorName: 'My Name',
		authorMail: 'name@domain.com',
		authorUrl: 'http://www.foo.com',
		license: 'MIT',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banners: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'little'
	};

	beforeAll(() => {
		return (
			helpers
				.run(path.join(__dirname, '../app'))

				// Clear the directory and set it as the CWD
				.inDir(path.join(os.tmpdir(), './temp-test'))

				// Mock options passed in
				.withOptions({
					'skip-install': true
				})

				// Mock the prompt answers
				.withPrompts(prompts)

				.toPromise()
		);
	});

	it('should have adapted settings in baumeister.json', () => {
		assert.fileContent([
			['baumeister.json', /"useHandlebars": false,/],
			['baumeister.json', /"ProvidePlugin": {}/]
		]);
	});

	it('should create no Handlebars related files', () => {
		assert.noFile(['src/**/*.hbs', 'src/handlebars']);
	});

	it('should create just the essential html files', () => {
		assert.file(['src/index.html']);
		assert.noFile(['src/stickyFooter.html', 'src/demoElements.html']);
	});

	it('should have an additional container in index.html', () => {
		assert.fileContent([['src/index.html', /<div id="root" \/>/]]);
	});

	it('should have a base element in index.html', () => {
		assert.fileContent([['src/index.html', /<base href="\/">/]]);
	});

	it('should not include navigation in index.html', () => {
		assert.noFileContent([['src/index.html', /role="navigation"/]]);
	});

	describe('Dependencies', () => {
		it('should not have jQuery and popper.js', () => {
			assert.noFileContent([['package.json', /jquery/], ['package.json', /popper.js/]]);
		});

		it('should have React and related dependencies', () => {
			assert.fileContent([
				['package.json', /react/],
				['package.json', /react-dom/],
				['package.json', /prop-types/]
			]);
		});

		it('should have React related dev dependencies', () => {
			assert.fileContent([
				['package.json', /eslint-plugin-react/],
				['package.json', /babel-plugin-transform-react-jsx/],
				['package.json', /babel-plugin-transform-class-properties/]
			]);
		});
	});

	it('should have React related plugins in .babelrc', () => {
		assert.fileContent([
			['src/app/.babelrc', /transform-class-properties/],
			['src/app/.babelrc', /transform-react-jsx/]
		]);
	});

	it('should have React related settings in .eslintrc', () => {
		assert.fileContent([
			['.eslintrc.json', /"plugin:react\/recommended"/],
			['.eslintrc.json', /"plugins": \["react"],/],
			['.eslintrc.json', /"ecmaFeatures": {"jsx": true}/]
		]);
	});

	it('should have historyApiFallback in dev server settings', () => {
		assert.fileContent([['build/webpack/config.dev-server.js', /historyApiFallback: true,/]]);
	});

	it('should not import Bootstrap in index.js', () => {
		assert.noFileContent([['src/app/index.js', /import 'bootstrap';/]]);
	});

	it('should use React in index.js', () => {
		assert.fileContent([
			['src/app/index.js', /import React from 'react';/],
			['src/app/index.js', /import ReactDOM from 'react-dom';/],
			['src/app/index.js', /ReactDOM\.render/]
		]);
	});
});

describe('Baumeister with banner', () => {
	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		authorName: 'My Name',
		authorMail: 'name@domain.com',
		authorUrl: 'http://www.foo.com',
		license: 'MIT',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banners: true,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'little'
	};

	beforeAll(() => {
		return (
			helpers
				.run(path.join(__dirname, '../app'))

				// Clear the directory and set it as the CWD
				.inDir(path.join(os.tmpdir(), './temp-test'))

				// Mock options passed in
				.withOptions({ 'skip-install': true })

				// Mock the prompt answers
				.withPrompts(prompts)
				.toPromise()
		);
	});

	it('should have `generateBanners` set to `true` in baumeister.json', () => {
		assert.fileContent('baumeister.json', /"generateBanners": true,/);
	});
});

describe('Baumeister without an open source license', () => {
	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		authorName: '',
		authorMail: '',
		authorUrl: '',
		license: 'All rights reserved',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banners: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'little'
	};

	beforeAll(() => {
		return (
			helpers
				.run(path.join(__dirname, '../app'))

				// Clear the directory and set it as the CWD
				.inDir(path.join(os.tmpdir(), './temp-test'))

				// Mock options passed in
				.withOptions({
					'skip-install': true
				})

				// Mock the prompt answers
				.withPrompts(prompts)

				.toPromise()
		);
	});

	it('should have authors name in LICENSE', () => {
		const regex = new RegExp(escapeStringRegexp(prompts.authorName), '');
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors URL in LICENSE', () => {
		const regex = new RegExp(escapeStringRegexp(prompts.authorUrl), '');
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', () => {
		const regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''), ''); // eslint-disable-line no-implicit-coercion
		assert.fileContent('LICENSE', regex);
	});

	it('should not have a open source license', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));

		assert.fileContent(
			'LICENSE',
			/All rights reserved. It is strictly prohibited to copy, redistribute,/
		);
		packageJson.should.have.property('license', prompts.license);
	});

	it('should have the correct license in the README file', () => {
		assert.fileContent('README.md', /not licensed under an open source license/);
	});
});

describe('Baumeister with Apache License, Version 2.0', () => {
	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		authorName: '',
		authorMail: '',
		authorUrl: '',
		license: 'Apache License, Version 2.0',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banners: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'little'
	};

	beforeAll(() => {
		return (
			helpers
				.run(path.join(__dirname, '../app'))

				// Clear the directory and set it as the CWD
				.inDir(path.join(os.tmpdir(), './temp-test'))

				// Mock options passed in
				.withOptions({
					'skip-install': true
				})

				// Mock the prompt answers
				.withPrompts(prompts)

				.toPromise()
		);
	});

	it('should have authors name in LICENSE', () => {
		const regex = new RegExp(escapeStringRegexp(prompts.authorName), '');
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors URL in LICENSE', () => {
		const regex = new RegExp(escapeStringRegexp(prompts.authorUrl), '');
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', () => {
		const regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''), ''); // eslint-disable-line no-implicit-coercion
		assert.fileContent('LICENSE', regex);
	});

	it('should have a Apache license', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));

		assert.fileContent('LICENSE', /Licensed under the Apache License, Version 2.0/);
		packageJson.should.have.property('license', prompts.license);
	});

	it('should have the correct license in the README file', () => {
		assert.fileContent('README.md', /Apache License, Version 2.0/);
	});
});

describe('Baumeister with GNU General Public License', () => {
	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		authorName: '',
		authorMail: '',
		authorUrl: '',
		license: 'GNU GPLv3',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banners: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'little'
	};

	beforeAll(() => {
		return (
			helpers
				.run(path.join(__dirname, '../app'))

				// Clear the directory and set it as the CWD
				.inDir(path.join(os.tmpdir(), './temp-test'))

				// Mock options passed in
				.withOptions({
					'skip-install': true
				})

				// Mock the prompt answers
				.withPrompts(prompts)

				.toPromise()
		);
	});

	it('should have authors name in LICENSE', () => {
		const regex = new RegExp(escapeStringRegexp(prompts.authorName), '');
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors URL in LICENSE', () => {
		const regex = new RegExp(escapeStringRegexp(prompts.authorUrl), '');
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', () => {
		const regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''), ''); // eslint-disable-line no-implicit-coercion
		assert.fileContent('LICENSE', regex);
	});

	it('should have a GNU General Public License', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));

		assert.fileContent('LICENSE', /GNU General Public License/);
		packageJson.should.have.property('license', prompts.license);
	});

	it('should have the correct license in the README file', () => {
		assert.fileContent('README.md', /GNU GPLv3 license/);
	});
});

describe('Baumeister with less boilerplate code as static website', () => {
	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		projectType: 'staticSite',
		authorName: 'My Name',
		authorMail: 'name@domain.com',
		authorUrl: 'http://www.foo.com',
		license: 'MIT',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banners: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'minimum'
	};

	beforeAll(() => {
		return (
			helpers
				.run(path.join(__dirname, '../app'))

				// Clear the directory and set it as the CWD
				.inDir(path.join(os.tmpdir(), './temp-test'))

				// Mock options passed in
				.withOptions({
					'skip-install': true
				})

				// Mock the prompt answers
				.withPrompts(prompts)

				.toPromise()
		);
	});

	it('should create just the essential handlebars files', () => {
		assert.file([
			'src/index.hbs',
			'src/handlebars/layouts/default.hbs',
			'src/handlebars/helpers/add-year.js',
			'src/handlebars/partials/.gitkeep'
		]);
		assert.noFile([
			'src/stickyFooter.hbs',
			'src/demoElements.hbs',
			'src/handlebars/partials/footer.hbs',
			'src/handlebars/partials/navbar.hbs'
		]);
	});

	it('should not include navigation and content in index.hbs', () => {
		assert.noFileContent([['src/index.hbs', /navbar|<p/g]]);
	});

	it('should create just the essential Sass files', () => {
		assert.noFile([
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_alerts.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_footer.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_mixins.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_scaffolding.scss'
		]);
	});

	it(
		'should only import the essential Sass files within _' +
			_s.slugify(prompts.theme) +
			'.scss file',
		() => {
			assert.noFileContent([
				['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /alerts"/],
				['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /footer"/],
				['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /mixins"/],
				['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /scaffolding"/]
			]);
		}
	);
});

describe('Baumeister with less boilerplate code as single page app', () => {
	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		projectType: 'spa',
		authorName: 'My Name',
		authorMail: 'name@domain.com',
		authorUrl: 'http://www.foo.com',
		license: 'MIT',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banners: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'minimum'
	};

	beforeAll(() => {
		return (
			helpers
				.run(path.join(__dirname, '../app'))

				// Clear the directory and set it as the CWD
				.inDir(path.join(os.tmpdir(), './temp-test'))

				// Mock options passed in
				.withOptions({
					'skip-install': true
				})

				// Mock the prompt answers
				.withPrompts(prompts)

				.toPromise()
		);
	});

	it('should create just the essential html files', () => {
		assert.file(['src/index.html']);
		assert.noFile([
			'src/stickyFooter.html',
			'src/demoElements.html',
			'src/handlebars/partials/footer.html',
			'src/handlebars/partials/navbar.hbs'
		]);
	});

	it('should not include navigation in index.html', () => {
		assert.noFileContent([['src/index.html', /role="navigation"/]]);
	});

	it('should create just the essential Sass files', () => {
		assert.noFile([
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_alerts.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_footer.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_ribbon.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_mixins.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_scaffolding.scss'
		]);
	});

	it(
		'should only import the essential Sass files within _' +
			_s.slugify(prompts.theme) +
			'.scss file',
		() => {
			assert.noFileContent([
				['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /alerts"/],
				['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /footer"/],
				['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /mixins"/],
				['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /scaffolding"/]
			]);
		}
	);
});

describe('Baumeister with `dist` added to version control', () => {
	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		authorName: '',
		authorMail: '',
		authorUrl: '',
		license: 'All rights reserved',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banners: false,
		addDistToVersionControl: true,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'little'
	};

	beforeAll(() => {
		return (
			helpers
				.run(path.join(__dirname, '../app'))

				// Clear the directory and set it as the CWD
				.inDir(path.join(os.tmpdir(), './temp-test'))

				// Mock options passed in
				.withOptions({
					'skip-install': true
				})

				// Mock the prompt answers
				.withPrompts(prompts)

				.toPromise()
		);
	});

	it('should not have `/dist` directory in .gitignore', () => {
		assert.noFileContent([['.gitignore', /dist/]]);
	});
});

describe('Baumeister using --yo-rc flag', () => {
	// Load prompt answers from yo-rc.json
	const prompts = JSON.parse(fs.readFileSync(path.join(__dirname, 'yo-rc.json')))[
		'generator-baumeister'
	];

	beforeAll(() => {
		return (
			helpers
				.run(path.join(__dirname, '../app'))

				// Clear the directory and set it as the CWD
				.inDir(path.join(os.tmpdir(), './temp-test'), () => {
					fs.writeFileSync('.yo-rc.json', fs.readFileSync(path.join(__dirname, 'yo-rc.json')));
				})

				.withOptions({
					'skip-install': true,
					'yo-rc': true
				})

				.toPromise()
		);
	});

	it('should create package manager files', () => {
		assert.file(['package.json']);
	});

	it('should create dot files', () => {
		assert.file(['.editorconfig', '.gitattributes', '.gitignore', '.eslintrc.json']);
	});

	it('should have `/dist` directory in .gitignore', () => {
		assert.fileContent([['.gitignore', /dist/]]);
	});

	it('should create handlebars files', () => {
		assert.file([
			'src/index.hbs',
			'src/stickyFooter.hbs',
			'src/demoElements.hbs',
			'src/handlebars/layouts/default.hbs',
			'src/handlebars/helpers/add-year.js',
			'src/handlebars/partials/footer.hbs',
			'src/handlebars/partials/navbar.hbs'
		]);
	});

	it("shouldn't create a static index.html file", () => {
		assert.noFile(['src/index.html']);
	});

	it('should create other project files', () => {
		assert.file([
			'README.md',
			'humans.txt',
			'LICENSE',
			'CONTRIBUTING.md',
			'CHANGELOG.md',
			'CODE_OF_CONDUCT.md'
		]);
	});

	it('should create assets', () => {
		assert.file([
			'src/assets',
			'src/assets/fonts',
			'src/assets/img',
			'src/app/base/base.js',
			'src/app/index.js',
			'src/app/base/polyfills.js',
			'src/assets/scss/index.scss',
			'src/assets/scss/_print.scss',
			'src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_alerts.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_footer.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_mixins.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_scaffolding.scss',
			'src/assets/scss/' + _s.slugify(prompts.theme) + '/_testResponsiveHelpers.scss',
			'src/assets/scss/_variables.scss'
		]);
	});

	it('should import all Sass files within _' + _s.slugify(prompts.theme) + '.scss file', () => {
		assert.fileContent([
			['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /testResponsiveHelpers/],
			['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /alerts/],
			['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /footer/],
			['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /mixins/],
			['src/assets/scss/_' + _s.slugify(prompts.theme) + '.scss', /scaffolding/]
		]);
	});

	it("should import '_variables.scss' within 'index.scss' file", () => {
		assert.fileContent([['src/assets/scss/index.scss', /.\/variables/]]);
	});

	it('should have a valid package.json file', () => {
		JSON.parse(fs.readFileSync('package.json'));
	});

	it('should render project name and description in package.json', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.property('name', _s.slugify(prompts.projectName));
		packageJson.should.have.property('title', _s.titleize(prompts.projectName));
		packageJson.should.have.property('description', prompts.projectDescription);
	});

	it('should render project name and description in README.md', () => {
		let regex = new RegExp(escapeStringRegexp(prompts.projectDescription), '');
		assert.fileContent('README.md', regex);
		regex = new RegExp(escapeStringRegexp(_s.titleize(prompts.projectName)), '');
		assert.fileContent('README.md', regex);
	});

	it('should render project name in HTML files', () => {
		const regex = new RegExp(escapeStringRegexp(_s.titleize(prompts.projectName)), '');
		assert.fileContent('src/handlebars/layouts/default.hbs', regex);
	});

	it('should render author name within the meta tags of HTML files', () => {
		const regex = new RegExp(
			escapeStringRegexp('<meta name="author" content="' + prompts.authorName + '">'),
			''
		);
		assert.fileContent('src/handlebars/layouts/default.hbs', regex);
	});

	it('should have the default output paths within the build config file', () => {
		const arg = [['build/config.js', new RegExp(escapeStringRegexp("prod: '../dist/'"), '')]];
		assert.fileContent(arg);
	});

	it('should not have dev dependency `grunt-git` in package.json', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.not.have.propertyByPath('devDependencies', 'grunt-git');
	});

	it('should have authors name in package.json and LICENSE', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));
		const regex = new RegExp(escapeStringRegexp(prompts.authorName), '');

		packageJson.should.have.propertyByPath('author', 'name').eql(prompts.authorName);
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors email in package.json', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));

		packageJson.should.have.propertyByPath('author', 'email').eql(prompts.authorMail);
	});

	it('should have authors URL in package.json and LICENSE', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));
		const regex = new RegExp(escapeStringRegexp(prompts.authorUrl), '');

		packageJson.should.have.propertyByPath('author', 'url').eql(prompts.authorUrl);
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', () => {
		const regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''), ''); // eslint-disable-line no-implicit-coercion
		assert.fileContent('LICENSE', regex);
	});

	it('should have a MIT LICENSE', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));

		assert.fileContent(
			'LICENSE',
			/copy, modify, merge, publish, distribute, sublicense, and\/or sell/
		);
		packageJson.should.have.property('license', prompts.license);
	});

	it('should have the initial version number in package.json', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.property('version', prompts.initialVersion);
	});

	it('should have the homepage and repository in package.json', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));

		packageJson.should.have.property('homepage', prompts.projectHomepage);
		packageJson.should.have.propertyByPath('repository', 'type').eql(prompts.projectRepositoryType);
		packageJson.should.have.propertyByPath('repository', 'url').eql(prompts.projectRepository);
	});

	it('should have the issue tracker url in package.json', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.propertyByPath('bugs', 'url').eql(prompts.issueTracker);
	});
});

describe('Baumeister prompting helpers', () => {
	describe('→ validateSemverVersion()', () => {
		it('should accept a valid semver version number', () => {
			assert.equal(helper.validateSemverVersion('1.0.0'), true);
		});
		it('should fail with a invalid semver version number', () => {
			assert.equal(
				helper.validateSemverVersion('beta-1'),
				chalk.red(
					'Please enter a valid semver version, i.e. MAJOR.MINOR.PATCH. See → https://nodesource.com/blog/semver-a-primer/'
				)
			);
		});
	});

	describe('→ defaultIssueTracker()', () => {
		it('should return a GitHub issues link for HTTPS repo clone URLs', () => {
			assert.equal(
				helper.defaultIssueTracker({
					projectRepository: 'https://github.com/micromata/baumeister.git'
				}),
				'https://github.com/micromata/baumeister/issues'
			);
		});
		it('should return a GitHub issues link for SSH repo clone URLs', () => {
			assert.equal(
				helper.defaultIssueTracker({
					projectRepository: 'git@github.com:micromata/baumeister.git'
				}),
				'https://github.com/micromata/baumeister/issues'
			);
		});
		it('should return an empty string when regex for Github clone URLs don’t match', () => {
			assert.equal(helper.defaultIssueTracker({ projectRepository: '' }), '');
		});
	});
});
