'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var os = require('os');
var _s = require('underscore.string');
var should = require('should'); // eslint-disable-line no-unused-vars
var fs = require('fs');
var escapeStringRegexp = require('escape-string-regexp');

describe('bootstrap-kickstart with default options', function () {

	// Define prompt answers
	var prompts = {
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
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.on('end', done);
	});

	it('should create package manager files', function () {
		assert.file([
			'bower.json',
			'package.json'
		]);
	});

	it('should create dot files', function () {
		assert.file([
			'.bowerrc',
			'.editorconfig',
			'.gitignore',
			'.jshintrc',
			'.eslintrc',
			'assets/js/.eslintrc'
		]);
	});

	it('should have `/dist` directory in .gitignore', function () {
		assert.fileContent([
			['.gitignore', /dist/]
		]);
	});

	it('should create handlebars files', function () {
		assert.file([
			'index.hbs',
			'stickyFooter.hbs',
			'demoElements.hbs',
			'templates/default.hbs',
			'templates/helpers/helpers.js',
			'partials/footer.hbs',
			'partials/navbar.hbs'
		]);
	});

	it('should create other project files', function () {
		assert.file([
			'README.md',
			'Gruntfile.js',
			'humans.txt',
			'LICENSE',
			'CONTRIBUTING.md'
		]);
	});

	it('should create assets', function () {
		assert.file([
			'assets',
			'assets/fonts',
			'assets/img',
			'assets/js/base.js',
			'assets/js/moduleSkeleton.js',
			'assets/less/base.less',
			'assets/less/index.less',
			'assets/less/print.less',
			'assets/less/' + _s.slugify(prompts.theme) + '.less',
			'assets/less/' + _s.slugify(prompts.theme) + '.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/alerts.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/demoElements.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/footer.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/ribbon.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/mixins.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/scaffolding.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/testResponsiveHelpers.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/variables.less'

		]);
	});

	it('should import all LESS files within ' + _s.slugify(prompts.theme) + '.less file', function () {
		assert.fileContent([
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /variables.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /testResponsiveHelpers.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /alerts.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /demoElements.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /footer.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /ribbon.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /mixins.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /scaffolding.less/]
		]);
	});

	it('should render author name and email within the comments of JavaScript files', function () {
		var regex = new RegExp(escapeStringRegexp('@author ' + prompts.authorName + ' <' + prompts.authorMail + '>'), '');
		var arg = [
			['assets/js/base.js', regex],
			['assets/js/moduleSkeleton.js', regex]
		];
		assert.fileContent(arg);
	});

	it('should set the namespace within JavaScript files according to prompted project name', function () {
		var regexShould = new RegExp(escapeStringRegexp('@namespace ' + _s.camelize(_s.slugify(prompts.projectName))), '');
		var argShould = [
			['assets/js/base.js', regexShould],
			['assets/js/moduleSkeleton.js', regexShould]
		];
		var regexShouldNot = /kickstarter/;
		var argShouldNot = [
			['assets/js/base.js', regexShouldNot],
			['assets/js/moduleSkeleton.js', regexShouldNot]
		];

		assert.fileContent(argShould);
		assert.noFileContent(argShouldNot);
	});

	it('should have a valid bower.json file', function () {
		JSON.parse(fs.readFileSync('bower.json'));
	});

	it('should have a valid package.json file', function () {
		JSON.parse(fs.readFileSync('package.json'));
	});

	it('should have a valid .jshintrc file', function () {
		JSON.parse(fs.readFileSync('.jshintrc'));
	});

	it('should have a valid .bowerrc file', function () {
		JSON.parse(fs.readFileSync('.bowerrc'));
	});

	it('should have a .postinstall.js file', function () {
		assert.file(['.postinstall.js']);
	});

	it('should not have dependencies to support oldIEs', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		bowerJson.should.not.have.propertyByPath('dependencies', 'html5shiv');
		bowerJson.should.not.have.propertyByPath('dependencies', 'respondJs');
		bowerJson.should.not.have.propertyByPath('dependencies', 'jquery-placeholder');
		bowerJson.should.have.propertyByPath('dependencies', 'jquery').containEql('2.2.3');
	});

	it('should not handle oldIE related files within Grunt tasks', function () {
		assert.noFileContent([
			['Gruntfile.js', /html5shiv/],
			['Gruntfile.js', /respondJs/],
			['Gruntfile.js', /jquery-placeholder/]
		]);
	});

	it('should not reference oldIE related files within HTML files', function () {
		assert.noFileContent([
			['templates/default.hbs', /html5shiv/],
			['templates/default.hbs', /respondJs/],
			['templates/default.hbs', /jquery-placeholder/]
		]);
	});

	it('should reference module skeleton in default template', function () {
		assert.fileContent([
			['templates/default.hbs', /moduleSkeleton.js/]
		]);
	});

	it('should not include »browsehappy« message', function () {
		assert.noFileContent([
			['templates/default.hbs', /browsehappy/]
		]);
	});

	it('should not include conditional classes to address oldIEs', function () {
		assert.noFileContent([
			['templates/default.hbs', /<html class="(.+)ie(\d+)">/g]
		]);
	});

	it('should render project name and description in bower.json', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		bowerJson.should.have.property('name', _s.slugify(prompts.projectName));
		bowerJson.should.have.property('description', prompts.projectDescription);
	});

	it('should render project name and description in package.json', function () {
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.property('name', _s.slugify(prompts.projectName));
		packageJson.should.have.property('title', _s.titleize(prompts.projectName));
		packageJson.should.have.property('description', prompts.projectDescription);
	});

	it('should render project name and description in README.md', function () {
		var regex = new RegExp(escapeStringRegexp(prompts.projectDescription), '');
		assert.fileContent('README.md', regex);
		regex = new RegExp(escapeStringRegexp(_s.titleize(prompts.projectName)), '');
		assert.fileContent('README.md', regex);
	});

	it('should render project name in HTML files', function () {
		var regex = new RegExp(escapeStringRegexp(_s.titleize(prompts.projectName)), '');
		assert.fileContent('templates/default.hbs', regex);
	});

	it('should render author name within the meta tags of HTML files', function () {
		var regex = new RegExp(escapeStringRegexp('<meta name="author" content="' + prompts.authorName + '" />'), '');
		assert.fileContent('templates/default.hbs', regex);
	});

	it('should have the default output paths within the Gruntfile', function () {
		var arg = [
			['Gruntfile.js', /dist/],
			['Gruntfile.js', /docs/],
			['Gruntfile.js', /reports/]
		];
		assert.fileContent(arg);
	});

	it('should not have a `gitadd` task within the Gruntfile', function () {
		var arg = [
			['Gruntfile.js', /gitadd/]
		];
		assert.noFileContent(arg);
	});

	it('should not have dev dependency `grunt-git` in package.json', function () {
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.not.have.propertyByPath('devDependencies', 'grunt-git');
	});

	it('should have authors name in bower.json, package.json and LICENSE', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		var regex = new RegExp(escapeStringRegexp(prompts.authorName), '');

		bowerJson.should.have.property('authors').match(regex);
		packageJson.should.have.propertyByPath('author', 'name').eql(prompts.authorName);
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors email in bower.json and package.json', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		var regex = new RegExp(escapeStringRegexp(prompts.authorMail), '');

		bowerJson.should.have.property('authors').match(regex);
		packageJson.should.have.propertyByPath('author', 'email').eql(prompts.authorMail);
	});

	it('should have authors URL in package.json and LICENSE', function () {
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		var regex = new RegExp(escapeStringRegexp(prompts.authorUrl), '');

		packageJson.should.have.propertyByPath('author', 'url').eql(prompts.authorUrl);
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', function () {
		var regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''), ''); // eslint-disable-line no-implicit-coercion
		assert.fileContent('LICENSE', regex);
	});

	it('should have a MIT LICENSE', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));

		assert.fileContent('LICENSE', /copy, modify, merge, publish, distribute, sublicense, and\/or sell/);
		bowerJson.should.have.property('license', prompts.license);
		packageJson.should.have.property('license', prompts.license);
	});

	it('should have the initial version number in bower.json and package.json', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		bowerJson.should.have.property('version', prompts.initialVersion);
		packageJson.should.have.property('version', prompts.initialVersion);
	});

	it('should have the homepage and repository in bower.json and package.json', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));

		bowerJson.should.have.property('homepage', prompts.projectHomepage);
		bowerJson.should.have.propertyByPath('repository', 'type').eql(prompts.projectRepositoryType);
		bowerJson.should.have.propertyByPath('repository', 'url').eql(prompts.projectRepository);

		packageJson.should.have.property('homepage', prompts.projectHomepage);
		packageJson.should.have.propertyByPath('repository', 'type').eql(prompts.projectRepositoryType);
		packageJson.should.have.propertyByPath('repository', 'url').eql(prompts.projectRepository);

	});

	it('should have the issue tracker url in package.json', function () {
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.propertyByPath('bugs', 'url').eql(prompts.issueTracker);
	});

});

describe('bootstrap-kickstart with oldIE support', function () {

	// Define prompt answers
	var prompts = {
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
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.on('end', done);
	});

	it('should have a valid bower.json file', function () {
		JSON.parse(fs.readFileSync('bower.json'));
	});

	it('should have dependencies to support oldIEs', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		bowerJson.should.have.propertyByPath('dependencies', 'html5shiv');
		bowerJson.should.have.propertyByPath('dependencies', 'respondJs');
		bowerJson.should.have.propertyByPath('dependencies', 'jquery-placeholder');
		bowerJson.should.have.propertyByPath('dependencies', 'jquery').containEql('1.12.3');
	});

	it('should handle oldIE related files within Grunt tasks', function () {
		assert.fileContent([
			['Gruntfile.js', /html5shiv/],
			['Gruntfile.js', /respondJs/],
			['Gruntfile.js', /jquery-placeholder/]
		]);
	});

	it('should reference oldIE related files within HTML files', function () {
		assert.fileContent([
			['templates/default.hbs', /html5shiv/],
			['templates/default.hbs', /respondJs/],
			['templates/default.hbs', /jquery-placeholder/]
		]);
	});

	it('should include »browsehappy« message', function () {
		assert.fileContent('templates/default.hbs', /browsehappy/);
	});

	it('should include conditional classes to address oldIEs', function () {
		assert.fileContent('templates/default.hbs', /<html class="(.+)ie(\d+)">/g);
	});

});

describe('bootstrap-kickstart with custom output paths', function () {

	// Define prompt answers
	var prompts = {
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
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.on('end', done);
	});

	it('should have the prompted output paths within the Gruntfile', function () {
		var arg = [
			['Gruntfile.js', new RegExp(escapeStringRegexp(prompts.distDirectory), '')],
			['Gruntfile.js', new RegExp(escapeStringRegexp(prompts.docsDirectory), '')],
			['Gruntfile.js', new RegExp(escapeStringRegexp(prompts.reportsDirectory), '')]
		];
		assert.fileContent(arg);
	});

});

describe('bootstrap-kickstart without an open source license', function () {

	// Define prompt answers
	var prompts = {
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
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.on('end', done);
	});

	it('should have authors name in LICENSE', function () {
		var regex = new RegExp(escapeStringRegexp(prompts.authorName), '');
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors URL in LICENSE', function () {
		var regex = new RegExp(escapeStringRegexp(prompts.authorUrl), '');
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', function () {
		var regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''), ''); // eslint-disable-line no-implicit-coercion
		assert.fileContent('LICENSE', regex);
	});

	it('should not have a open source license', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));

		assert.fileContent('LICENSE', /All rights reserved. It is strictly prohibited to copy, redistribute, republish/);
		bowerJson.should.have.property('license', prompts.license);
		packageJson.should.have.property('license', prompts.license);
	});

});

describe('bootstrap-kickstart with Apache License, Version 2.0', function () {

	// Define prompt answers
	var prompts = {
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
		issueTracker: 'https://github.com/userName/repository/issues',
		addDistToVersionControl: false,
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.on('end', done);
	});

	it('should have authors name in LICENSE', function () {
		var regex = new RegExp(escapeStringRegexp(prompts.authorName), '');
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors URL in LICENSE', function () {
		var regex = new RegExp(escapeStringRegexp(prompts.authorUrl), '');
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', function () {
		var regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''), ''); // eslint-disable-line no-implicit-coercion
		assert.fileContent('LICENSE', regex);
	});

	it('should have a Apache license', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));

		assert.fileContent('LICENSE', /Licensed under the Apache License, Version 2.0/);
		bowerJson.should.have.property('license', prompts.license);
		packageJson.should.have.property('license', prompts.license);
	});

});

describe('bootstrap-kickstart with GNU General Public License', function () {

	// Define prompt answers
	var prompts = {
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
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.on('end', done);
	});

	it('should have authors name in LICENSE', function () {
		var regex = new RegExp(escapeStringRegexp(prompts.authorName), '');
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors URL in LICENSE', function () {
		var regex = new RegExp(escapeStringRegexp(prompts.authorUrl), '');
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', function () {
		var regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''), ''); // eslint-disable-line no-implicit-coercion
		assert.fileContent('LICENSE', regex);
	});

	it('should have a GNU General Public License', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));

		assert.fileContent('LICENSE', /GNU General Public License/);
		bowerJson.should.have.property('license', prompts.license);
		packageJson.should.have.property('license', prompts.license);
	});

});

describe('bootstrap-kickstart with less boilerplate code', function () {

	// Define prompt answers
	var prompts = {
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
		addDistToVersionControl: false,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Almost nothing - Just the minimum files and folders'
	};

	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.on('end', done);
	});

	it('should create just the essential handlebars files', function () {
		assert.file([
			'index.hbs',
			'templates/default.hbs',
			'templates/helpers/helpers.js',
			'partials/.gitkeep'
		]);
		assert.noFile([
			'stickyFooter.hbs',
			'demoElements.hbs',
			'partials/footer.hbs',
			'partials/navbar.hbs'
		]);
	});

	it('should not include navigation and content in index.hbs', function () {
		assert.noFileContent([
			['index.hbs', /navbar|<p/g]
		]);
	});

	it('should not reference module skeleton in default template', function () {
		assert.noFileContent([
			['templates/default.hbs', /moduleSkeleton.js/]
		]);
	});

	it('should create just a single JavaScript file (base.js)', function () {
		assert.file(['assets/js/base.js']);
		assert.noFile([
			'assets/js/moduleSkeleton.js'
		]);
	});

	it('should create just the essential LESS files', function () {
		assert.noFile([
			'assets/less/' + _s.slugify(prompts.theme) + '/alerts.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/demoElements.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/footer.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/ribbon.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/mixins.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/scaffolding.less'
		]);
	});

	it('should only import the essential LESS files within ' + _s.slugify(prompts.theme) + '.less file', function () {
		assert.noFileContent([
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /alerts.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /demoElements.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /footer.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /ribbon.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /mixins.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /scaffolding.less/]
		]);
	});

});

describe('bootstrap-kickstart with `dist` added to version control', function () {

	// Define prompt answers
	var prompts = {
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
		addDistToVersionControl: true,
		issueTracker: 'https://github.com/userName/repository/issues',
		boilerplateAmount: 'Just a little – Get started with a few example files'
	};

	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompts(prompts)

		.on('end', done);
	});

	it('should not have `/dist` directory in .gitignore', function () {
		assert.noFileContent([
			['.gitignore', /dist/]
		]);
	});

	it('should have dev dependency `grunt-git` in package.json', function () {
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.propertyByPath('devDependencies', 'grunt-git');
	});

	it('should have a `gitadd` task within the Gruntfile', function () {
		var arg = [
			['Gruntfile.js', /gitadd/]
		];
		assert.fileContent(arg);
	});

});

describe('bootstrap-kickstart using --yo-rc flag', function () {

	// load prompt answers from yo-rc.json
	var prompts = JSON.parse(fs.readFileSync(path.join(__dirname, 'yo-rc.json')))['generator-bootstrap-kickstart'];

	before(function (done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'), function () {
			fs.writeFileSync('.yo-rc.json', fs.readFileSync(path.join(__dirname, 'yo-rc.json')));
		})

		.withOptions({
			'skip-install': true,
			'yo-rc': true
		})

		.on('end', done);
	});

	it('should create package manager files', function () {
		assert.file([
			'bower.json',
			'package.json'
		]);
	});

	it('should create dot files', function () {
		assert.file([
			'.bowerrc',
			'.editorconfig',
			'.gitignore',
			'.jshintrc',
			'.eslintrc',
			'assets/js/.eslintrc'
		]);
	});

	it('should have `/dist` directory in .gitignore', function () {
		assert.fileContent([
			['.gitignore', /dist/]
		]);
	});

	it('should create handlebars files', function () {
		assert.file([
			'index.hbs',
			'stickyFooter.hbs',
			'demoElements.hbs',
			'templates/default.hbs',
			'templates/helpers/helpers.js',
			'partials/footer.hbs',
			'partials/navbar.hbs'
		]);
	});

	it('should create other project files', function () {
		assert.file([
			'README.md',
			'Gruntfile.js',
			'humans.txt',
			'LICENSE',
			'CONTRIBUTING.md'
		]);
	});

	it('should create assets', function () {
		assert.file([
			'assets',
			'assets/fonts',
			'assets/img',
			'assets/js/base.js',
			'assets/js/moduleSkeleton.js',
			'assets/less/base.less',
			'assets/less/index.less',
			'assets/less/print.less',
			'assets/less/' + _s.slugify(prompts.theme) + '.less',
			'assets/less/' + _s.slugify(prompts.theme) + '.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/alerts.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/demoElements.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/footer.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/ribbon.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/mixins.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/scaffolding.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/testResponsiveHelpers.less',
			'assets/less/' + _s.slugify(prompts.theme) + '/variables.less'

		]);
	});

	it('should import all LESS files within ' + _s.slugify(prompts.theme) + '.less file', function () {
		assert.fileContent([
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /variables.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /testResponsiveHelpers.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /alerts.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /demoElements.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /footer.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /ribbon.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /mixins.less/],
			['assets/less/' + _s.slugify(prompts.theme) + '.less', /scaffolding.less/]
		]);
	});

	it('should render author name and email within the comments of JavaScript files', function () {
		var regex = new RegExp(escapeStringRegexp('@author ' + prompts.authorName + ' <' + prompts.authorMail + '>'), '');
		var arg = [
			['assets/js/base.js', regex],
			['assets/js/moduleSkeleton.js', regex]
		];
		assert.fileContent(arg);
	});

	it('should set the namespace within JavaScript files according to prompted project name', function () {
		var regexShould = new RegExp(escapeStringRegexp('@namespace ' + _s.camelize(_s.slugify(prompts.projectName))), '');
		var argShould = [
			['assets/js/base.js', regexShould],
			['assets/js/moduleSkeleton.js', regexShould]
		];
		var regexShouldNot = /kickstarter/;
		var argShouldNot = [
			['assets/js/base.js', regexShouldNot],
			['assets/js/moduleSkeleton.js', regexShouldNot]
		];

		assert.fileContent(argShould);
		assert.noFileContent(argShouldNot);
	});

	it('should have a valid bower.json file', function () {
		JSON.parse(fs.readFileSync('bower.json'));
	});

	it('should have a valid package.json file', function () {
		JSON.parse(fs.readFileSync('package.json'));
	});

	it('should have a valid .jshintrc file', function () {
		JSON.parse(fs.readFileSync('.jshintrc'));
	});

	it('should have a valid .bowerrc file', function () {
		JSON.parse(fs.readFileSync('.bowerrc'));
	});

	it('should have a .postinstall.js file', function () {
		assert.file(['.postinstall.js']);
	});

	it('should not have dependencies to support oldIEs', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		bowerJson.should.not.have.propertyByPath('dependencies', 'html5shiv');
		bowerJson.should.not.have.propertyByPath('dependencies', 'respondJs');
		bowerJson.should.not.have.propertyByPath('dependencies', 'jquery-placeholder');
		bowerJson.should.have.propertyByPath('dependencies', 'jquery').containEql('2.2.3');
	});

	it('should not handle oldIE related files within Grunt tasks', function () {
		assert.noFileContent([
			['Gruntfile.js', /html5shiv/],
			['Gruntfile.js', /respondJs/],
			['Gruntfile.js', /jquery-placeholder/]
		]);
	});

	it('should not reference oldIE related files within HTML files', function () {
		assert.noFileContent([
			['templates/default.hbs', /html5shiv/],
			['templates/default.hbs', /respondJs/],
			['templates/default.hbs', /jquery-placeholder/]
		]);
	});

	it('should reference module skeleton in default template', function () {
		assert.fileContent([
			['templates/default.hbs', /moduleSkeleton.js/]
		]);
	});

	it('should not include »browsehappy« message', function () {
		assert.noFileContent([
			['templates/default.hbs', /browsehappy/]
		]);
	});

	it('should not include conditional classes to address oldIEs', function () {
		assert.noFileContent([
			['templates/default.hbs', /<html class="(.+)ie(\d+)">/g]
		]);
	});

	it('should render project name and description in bower.json', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		bowerJson.should.have.property('name', _s.slugify(prompts.projectName));
		bowerJson.should.have.property('description', prompts.projectDescription);
	});

	it('should render project name and description in package.json', function () {
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.property('name', _s.slugify(prompts.projectName));
		packageJson.should.have.property('title', _s.titleize(prompts.projectName));
		packageJson.should.have.property('description', prompts.projectDescription);
	});

	it('should render project name and description in README.md', function () {
		var regex = new RegExp(escapeStringRegexp(prompts.projectDescription), '');
		assert.fileContent('README.md', regex);
		regex = new RegExp(escapeStringRegexp(_s.titleize(prompts.projectName)), '');
		assert.fileContent('README.md', regex);
	});

	it('should render project name in HTML files', function () {
		var regex = new RegExp(escapeStringRegexp(_s.titleize(prompts.projectName)), '');
		assert.fileContent('templates/default.hbs', regex);
	});

	it('should render author name within the meta tags of HTML files', function () {
		var regex = new RegExp(escapeStringRegexp('<meta name="author" content="' + prompts.authorName + '" />'), '');
		assert.fileContent('templates/default.hbs', regex);
	});

	it('should have the default output paths within the Gruntfile', function () {
		var arg = [
			['Gruntfile.js', /dist/],
			['Gruntfile.js', /docs/],
			['Gruntfile.js', /reports/]
		];
		assert.fileContent(arg);
	});

	it('should not have a `gitadd` task within the Gruntfile', function () {
		var arg = [
			['Gruntfile.js', /gitadd/]
		];
		assert.noFileContent(arg);
	});

	it('should not have dev dependency `grunt-git` in package.json', function () {
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.not.have.propertyByPath('devDependencies', 'grunt-git');
	});

	it('should have authors name in bower.json, package.json and LICENSE', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		var regex = new RegExp(escapeStringRegexp(prompts.authorName), '');

		bowerJson.should.have.property('authors').match(regex);
		packageJson.should.have.propertyByPath('author', 'name').eql(prompts.authorName);
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors email in bower.json and package.json', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		var regex = new RegExp(escapeStringRegexp(prompts.authorMail), '');

		bowerJson.should.have.property('authors').match(regex);
		packageJson.should.have.propertyByPath('author', 'email').eql(prompts.authorMail);
	});

	it('should have authors URL in package.json and LICENSE', function () {
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		var regex = new RegExp(escapeStringRegexp(prompts.authorUrl), '');

		packageJson.should.have.propertyByPath('author', 'url').eql(prompts.authorUrl);
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', function () {
		var regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''), ''); // eslint-disable-line no-implicit-coercion
		assert.fileContent('LICENSE', regex);
	});

	it('should have a MIT LICENSE', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));

		assert.fileContent('LICENSE', /copy, modify, merge, publish, distribute, sublicense, and\/or sell/);
		bowerJson.should.have.property('license', prompts.license);
		packageJson.should.have.property('license', prompts.license);
	});

	it('should have the initial version number in bower.json and package.json', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		bowerJson.should.have.property('version', prompts.initialVersion);
		packageJson.should.have.property('version', prompts.initialVersion);
	});

	it('should have the homepage and repository in bower.json and package.json', function () {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		var packageJson = JSON.parse(fs.readFileSync('package.json'));

		bowerJson.should.have.property('homepage', prompts.projectHomepage);
		bowerJson.should.have.propertyByPath('repository', 'type').eql(prompts.projectRepositoryType);
		bowerJson.should.have.propertyByPath('repository', 'url').eql(prompts.projectRepository);

		packageJson.should.have.property('homepage', prompts.projectHomepage);
		packageJson.should.have.propertyByPath('repository', 'type').eql(prompts.projectRepositoryType);
		packageJson.should.have.propertyByPath('repository', 'url').eql(prompts.projectRepository);

	});

	it('should have the issue tracker url in package.json', function () {
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.propertyByPath('bugs', 'url').eql(prompts.issueTracker);
	});

});
