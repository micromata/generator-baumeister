'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const os = require('os');
const _s = require('underscore.string');
const should = require('should'); // eslint-disable-line no-unused-vars
const fs = require('fs');
const escapeStringRegexp = require('escape-string-regexp');

describe('Baumeister with default options', () => {

	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		oldIeSupport: false,
		customPaths: false,
		authorName: 'My Name',
		authorMail: 'name@domain.com',
		authorUrl: 'http://www.foo.com',
		license: 'MIT',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banner: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(() => {
		return helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.toPromise();
	});

	it('should create package manager files', () => {
		assert.file([
			'package.json'
		]);
	});

	it('should have an empty string as banner within the Gruntfile', () => {
		assert.fileContent('Gruntfile.js', /banner: ''/);
	});

	it('should create dot files', () => {
		assert.file([
			'.editorconfig',
			'.gitignore',
			'.babelrc',
			'.travis.yml',
			'.eslintrc.json',
			'src/app/.eslintrc.json'
		]);
	});

	it('should have `/dist` directory in .gitignore', () => {
		assert.fileContent([
			['.gitignore', /dist/]
		]);
	});

	it('should create handlebars files', () => {
		assert.file([
			'src/index.hbs',
			'src/stickyFooter.hbs',
			'src/demoElements.hbs',
			'src/templates/default.hbs',
			'src/templates/helpers/helpers.js',
			'src/partials/footer.hbs',
			'src/partials/navbar.hbs'
		]);
	});

	it('should create other project files', () => {
		assert.file([
			'README.md',
			'Gruntfile.js',
			'humans.txt',
			'LICENSE',
			'CONTRIBUTING.md'
		]);
	});

	it('should create assets', () => {
		assert.file([
			'src/assets',
			'src/assets/fonts',
			'src/assets/img',
			'src/app/base.js',
			'src/app/index.js',
			'src/assets/less/base.less',
			'src/assets/less/index.less',
			'src/assets/less/print.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/alerts.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/demoElements.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/footer.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/ribbon.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/mixins.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/scaffolding.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/testResponsiveHelpers.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/variables.less'

		]);
	});

	it('should import all LESS files within ' + _s.slugify(prompts.theme) + '.less file', () => {
		assert.fileContent([
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /variables.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /testResponsiveHelpers.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /alerts.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /demoElements.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /footer.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /ribbon.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /mixins.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /scaffolding.less/]
		]);
	});

	it('should render author name and email within the comments of JavaScript files', () => {
		const regex = new RegExp(escapeStringRegexp('@author ' + prompts.authorName + ' <' + prompts.authorMail + '>'), '');
		const arg = [
			['src/app/base.js', regex],
			['src/app/index.js', regex]
		];
		assert.fileContent(arg);
	});

	it('should have a valid package.json file', () => {
		JSON.parse(fs.readFileSync('package.json'));
	});

	it('should have a .postinstall.js file', () => {
		assert.file(['.postinstall.js']);
	});

	it('should not have dependencies to support oldIEs', () => {
		const pkgJson = JSON.parse(fs.readFileSync('package.json'));
		pkgJson.should.not.have.propertyByPath('dependencies', 'html5shiv');
		pkgJson.should.not.have.propertyByPath('dependencies', 'respond.js');
		pkgJson.should.not.have.propertyByPath('dependencies', 'jquery-placeholder');
		pkgJson.should.have.propertyByPath('dependencies', 'jquery').containEql('3.2.1');
	});

	it('should not handle oldIE related files within package.json', () => {
		const pkgJson = JSON.parse(fs.readFileSync('package.json'));
		assert(pkgJson.baumeister.includeStaticFiles.indexOf('html5shiv/dist/html5shiv-printshiv.min.js') === -1);
		assert(pkgJson.baumeister.includeStaticFiles.indexOf('respond.js/dest/respond.min.js') === -1);
	});

	it('should not reference oldIE related files within HTML files', () => {
		assert.noFileContent([
			['src/templates/default.hbs', /html5shiv/],
			['src/templates/default.hbs', /respond.js/],
			['src/templates/default.hbs', /jquery-placeholder/]
		]);
	});

	it('should include »browsehappy« message', () => {
		assert.fileContent([
			['src/templates/default.hbs', /browsehappy/]
		]);
	});

	it('should not include conditional classes to address oldIEs', () => {
		assert.noFileContent([
			['src/templates/default.hbs', /<html lang="en" class="(.+)ie(\d+)">/g]
		]);
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
		assert.fileContent('src/templates/default.hbs', regex);
	});

	it('should render author name within the meta tags of HTML files', () => {
		const regex = new RegExp(escapeStringRegexp('<meta name="author" content="' + prompts.authorName + '" />'), '');
		assert.fileContent('src/templates/default.hbs', regex);
	});

	it('should have the default output paths within the Gruntfile', () => {
		const arg = [
			['Gruntfile.js', /dist/],
			['Gruntfile.js', /docs/],
			['Gruntfile.js', /reports/]
		];
		assert.fileContent(arg);
	});

	it('should not have a `gitadd` task within the Gruntfile', () => {
		const arg = [
			['Gruntfile.js', /gitadd/]
		];
		assert.noFileContent(arg);
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

		assert.fileContent('LICENSE', /copy, modify, merge, publish, distribute, sublicense, and\/or sell/);
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

describe('Baumeister with banner', () => {

// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		oldIeSupport: false,
		customPaths: false,
		authorName: 'My Name',
		authorMail: 'name@domain.com',
		authorUrl: 'http://www.foo.com',
		license: 'MIT',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banner: true,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(() => {
		return helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.toPromise();
	});

	it('should have the message like defined in the template of the Gruntfile', () => {
		assert.fileContent('Gruntfile.js', /banner: '\/\*! <%= pkg\.title %> - v<%= pkg\.version %>\\n' \+/);
	});
});

describe('Baumeister with oldIE support', () => {

	// Define prompt answers
	const prompts = {
		projectName: '',
		projectDescription: '',
		theme: 'My theme',
		oldIeSupport: true,
		customPaths: false,
		authorName: 'My Name',
		authorMail: 'name@domain.com',
		authorUrl: 'http://www.foo.com',
		license: 'MIT',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banner: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(() => {
		return helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.toPromise();
	});

	it('should have dependencies to support oldIEs', () => {
		const pkgJson = JSON.parse(fs.readFileSync('package.json'));
		pkgJson.should.have.propertyByPath('dependencies', 'html5shiv');
		pkgJson.should.have.propertyByPath('dependencies', 'respond.js');
		pkgJson.should.have.propertyByPath('dependencies', 'jquery-placeholder');
		pkgJson.should.have.propertyByPath('dependencies', 'jquery').containEql('1.12.4');
	});

	it('should handle oldIE related files within package.json', () => {
		const pkgJson = JSON.parse(fs.readFileSync('package.json'));
		assert(pkgJson.baumeister.includeStaticFiles.indexOf('html5shiv/dist/html5shiv-printshiv.min.js') !== -1);
		assert(pkgJson.baumeister.includeStaticFiles.indexOf('respond.js/dest/respond.min.js') !== -1);
	});

	it('should reference oldIE related files within HTML files', () => {
		assert.fileContent([
			['src/templates/default.hbs', /html5shiv/],
			['src/templates/default.hbs', /respond.js/],
			['src/templates/default.hbs', /jquery-placeholder/]
		]);
	});

	it('should include »browsehappy« message', () => {
		assert.fileContent('src/templates/default.hbs', /browsehappy/);
	});

	it('should include conditional classes to address oldIEs', () => {
		assert.fileContent('src/templates/default.hbs', /<html lang="en" class="(.+)ie(\d+)">/g);
	});

});

describe('Baumeister with custom output paths', () => {

	// Define prompt answers
	const prompts = {
		projectName: '',
		projectDescription: '',
		theme: 'My theme',
		oldIeSupport: true,
		customPaths: true,
		distDirectory: 'disty',
		docsDirectory: 'docsy',
		reportsDirectory: 'reportsy',
		authorName: 'My Name',
		authorMail: 'name@domain.com',
		authorUrl: 'http://www.foo.com',
		license: 'MIT',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banner: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(() => {
		return helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.toPromise();
	});

	it('should have the prompted output paths within the Gruntfile', () => {
		const arg = [
			['Gruntfile.js', new RegExp(escapeStringRegexp(prompts.distDirectory), '')],
			['Gruntfile.js', new RegExp(escapeStringRegexp(prompts.docsDirectory), '')],
			['Gruntfile.js', new RegExp(escapeStringRegexp(prompts.reportsDirectory), '')]
		];
		assert.fileContent(arg);
	});

});

describe('Baumeister without an open source license', () => {

	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		oldIeSupport: false,
		customPaths: false,
		authorName: '',
		authorMail: '',
		authorUrl: '',
		license: 'All rights reserved',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banner: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(() => {
		return helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.toPromise();
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

		assert.fileContent('LICENSE', /All rights reserved. It is strictly prohibited to copy, redistribute, republish/);
		packageJson.should.have.property('license', prompts.license);
	});

});

describe('Baumeister with Apache License, Version 2.0', () => {

	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		oldIeSupport: false,
		customPaths: false,
		authorName: '',
		authorMail: '',
		authorUrl: '',
		license: 'Apache License, Version 2.0',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banner: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(() => {
		return helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.toPromise();
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

});

describe('Baumeister with GNU General Public License', () => {

	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		oldIeSupport: false,
		customPaths: false,
		authorName: '',
		authorMail: '',
		authorUrl: '',
		license: 'GNU GPLv3',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banner: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(() => {
		return helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.toPromise();
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

});

describe('Baumeister with less boilerplate code', () => {

	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		oldIeSupport: false,
		customPaths: false,
		authorName: 'My Name',
		authorMail: 'name@domain.com',
		authorUrl: 'http://www.foo.com',
		license: 'MIT',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banner: false,
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Almost nothing - Just the minimum files and folders'
	};

	before(() => {
		return helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.toPromise();
	});

	it('should create just the essential handlebars files', () => {
		assert.file([
			'src/index.hbs',
			'src/templates/default.hbs',
			'src/templates/helpers/helpers.js',
			'src/partials/.gitkeep'
		]);
		assert.noFile([
			'src/stickyFooter.hbs',
			'src/demoElements.hbs',
			'src/partials/footer.hbs',
			'src/partials/navbar.hbs'
		]);
	});

	it('should not include navigation and content in index.hbs', () => {
		assert.noFileContent([
			['src/index.hbs', /navbar|<p/g]
		]);
	});

	it('should create just the essential LESS files', () => {
		assert.noFile([
			'src/assets/less/' + _s.slugify(prompts.theme) + '/alerts.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/demoElements.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/footer.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/ribbon.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/mixins.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/scaffolding.less'
		]);
	});

	it('should only import the essential LESS files within ' + _s.slugify(prompts.theme) + '.less file', () => {
		assert.noFileContent([
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /alerts.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /demoElements.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /footer.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /ribbon.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /mixins.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /scaffolding.less/]
		]);
	});

});

describe('Baumeister with `dist` added to version control', () => {

	// Define prompt answers
	const prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		theme: 'My theme',
		oldIeSupport: false,
		customPaths: false,
		authorName: '',
		authorMail: '',
		authorUrl: '',
		license: 'All rights reserved',
		initialVersion: '0.0.0',
		projectHomepage: 'https://github.com/userName/repository',
		projectRepositoryType: 'git',
		projectRepository: 'git@github.com:userName/repository.git',
		banner: false,
		addDistToVersionControl: true,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(() => {
		return helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.toPromise();
	});

	it('should not have `/dist` directory in .gitignore', () => {
		assert.noFileContent([
			['.gitignore', /dist/]
		]);
	});

	it('should have dev dependency `grunt-git` in package.json', () => {
		const packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.propertyByPath('devDependencies', 'grunt-git');
	});

	it('should have a `gitadd` task within the Gruntfile', () => {
		const arg = [
			['Gruntfile.js', /gitadd/]
		];
		assert.fileContent(arg);
	});

});

describe('Baumeister using --yo-rc flag', () => {

	// Load prompt answers from yo-rc.json
	const prompts = JSON.parse(fs.readFileSync(path.join(__dirname, 'yo-rc.json')))['generator-bootstrap-kickstart'];

	before(() => {
		return helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'), () => {
			fs.writeFileSync('.yo-rc.json', fs.readFileSync(path.join(__dirname, 'yo-rc.json')));
		})

		.withOptions({
			'skip-install': true,
			'yo-rc': true
		})

		.toPromise();
	});

	it('should create package manager files', () => {
		assert.file([
			'package.json'
		]);
	});

	it('should create dot files', () => {
		assert.file([
			'.editorconfig',
			'.gitignore',
			'.eslintrc.json',
			'src/app/.eslintrc.json'
		]);
	});

	it('should have `/dist` directory in .gitignore', () => {
		assert.fileContent([
			['.gitignore', /dist/]
		]);
	});

	it('should create handlebars files', () => {
		assert.file([
			'src/index.hbs',
			'src/stickyFooter.hbs',
			'src/demoElements.hbs',
			'src/templates/default.hbs',
			'src/templates/helpers/helpers.js',
			'src/partials/footer.hbs',
			'src/partials/navbar.hbs'
		]);
	});

	it('should create other project files', () => {
		assert.file([
			'README.md',
			'Gruntfile.js',
			'humans.txt',
			'LICENSE',
			'CONTRIBUTING.md'
		]);
	});

	it('should create assets', () => {
		assert.file([
			'src/assets',
			'src/assets/fonts',
			'src/assets/img',
			'src/app/base.js',
			'src/app/index.js',
			'src/assets/less/base.less',
			'src/assets/less/index.less',
			'src/assets/less/print.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/alerts.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/demoElements.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/footer.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/ribbon.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/mixins.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/scaffolding.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/testResponsiveHelpers.less',
			'src/assets/less/' + _s.slugify(prompts.theme) + '/variables.less'

		]);
	});

	it('should import all LESS files within ' + _s.slugify(prompts.theme) + '.less file', () => {
		assert.fileContent([
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /variables.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /testResponsiveHelpers.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /alerts.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /demoElements.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /footer.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /ribbon.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /mixins.less/],
			['src/assets/less/' + _s.slugify(prompts.theme) + '.less', /scaffolding.less/]
		]);
	});

	it('should render author name and email within the comments of JavaScript files', () => {
		const regex = new RegExp(escapeStringRegexp('@author ' + prompts.authorName + ' <' + prompts.authorMail + '>'), '');
		const arg = [
			['src/app/base.js', regex],
			['src/app/index.js', regex]
		];
		assert.fileContent(arg);
	});

	it('should have a valid package.json file', () => {
		JSON.parse(fs.readFileSync('package.json'));
	});

	it('should have a .postinstall.js file', () => {
		assert.file(['.postinstall.js']);
	});

	it('should not have dependencies to support oldIEs', () => {
		const pkgJson = JSON.parse(fs.readFileSync('package.json'));
		pkgJson.should.not.have.propertyByPath('dependencies', 'html5shiv');
		pkgJson.should.not.have.propertyByPath('dependencies', 'respond.js');
		pkgJson.should.not.have.propertyByPath('dependencies', 'jquery-placeholder');
		pkgJson.should.have.propertyByPath('dependencies', 'jquery').containEql('3.2.1');
	});

	it('should not handle oldIE related files within package.json', () => {
		const pkgJson = JSON.parse(fs.readFileSync('package.json'));
		assert(pkgJson.baumeister.includeStaticFiles.indexOf('html5shiv/dist/html5shiv-printshiv.min.js') === -1);
		assert(pkgJson.baumeister.includeStaticFiles.indexOf('respond.js/dest/respond.min.js') === -1);
	});

	it('should not reference oldIE related files within HTML files', () => {
		assert.noFileContent([
			['src/templates/default.hbs', /html5shiv/],
			['src/templates/default.hbs', /respond.js/],
			['src/templates/default.hbs', /jquery-placeholder/]
		]);
	});

	it('should include »browsehappy« message', () => {
		assert.fileContent([
			['src/templates/default.hbs', /browsehappy/]
		]);
	});

	it('should not include conditional classes to address oldIEs', () => {
		assert.noFileContent([
			['src/templates/default.hbs', /<html lang="en" class="(.+)ie(\d+)">/g]
		]);
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
		assert.fileContent('src/templates/default.hbs', regex);
	});

	it('should render author name within the meta tags of HTML files', () => {
		const regex = new RegExp(escapeStringRegexp('<meta name="author" content="' + prompts.authorName + '" />'), '');
		assert.fileContent('src/templates/default.hbs', regex);
	});

	it('should have the default output paths within the Gruntfile', () => {
		const arg = [
			['Gruntfile.js', /dist/],
			['Gruntfile.js', /docs/],
			['Gruntfile.js', /reports/]
		];
		assert.fileContent(arg);
	});

	it('should not have a `gitadd` task within the Gruntfile', () => {
		const arg = [
			['Gruntfile.js', /gitadd/]
		];
		assert.noFileContent(arg);
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

		assert.fileContent('LICENSE', /copy, modify, merge, publish, distribute, sublicense, and\/or sell/);
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
