'use strict';

var path = require('path'),
	assert = require('yeoman-generator').assert,
	helpers = require('yeoman-generator').test,
	os = require('os'),
	_s = require('underscore.string'),
	should = require('should'),
	fs = require('fs'),
	escapeStringRegexp = require('escape-string-regexp');

describe('bootstrap-kickstart → default', function() {

	// Define prompt answers
	var prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		customerName: 'My customer',
		oldIeSupport: false,
		customPaths: false,
		authorName: 'My Name',
		authorMail: 'name@domain.com',
		authorUrl: 'http://www.foo.com',
		license: 'The MIT License (MIT)',
		initialVersion: '0.0.0'
	};

	before(function(done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompt(prompts)

		.on('end', done);
	});

	it('should create package manager files', function() {
		assert.file([
			'bower.json',
			'package.json'
		]);
	});

	it('should create dot files', function() {
		assert.file([
			'.bowerrc',
			'.editorconfig',
			'.gitignore',
			'.jshintrc'
		]);
	});

	it('should create project files', function() {
		assert.file([
			'index.html',
			'stickyFooter.html',
			'demoElements.html',
			'README.md',
			'Gruntfile.js',
			'humans.txt',
			'LICENSE',
			'CONTRIBUTING.md'
		]);
	});

	it('should create assets', function() {
		assert.file([
			'assets',
			'assets/fonts',
			'assets/img',
			'assets/js',
			'assets/less/base.less',
			'assets/less/index.less',
			'assets/less/print.less',
			'assets/less/' + _s.slugify(prompts.customerName) + '.less',
			'assets/less/' + _s.slugify(prompts.customerName) + '.less',
			'assets/less/' + _s.slugify(prompts.customerName) + '/alerts.less',
			'assets/less/' + _s.slugify(prompts.customerName) + '/demoElements.less',
			'assets/less/' + _s.slugify(prompts.customerName) + '/footer.less',
			'assets/less/' + _s.slugify(prompts.customerName) + '/ribbon.less',
			'assets/less/' + _s.slugify(prompts.customerName) + '/mixins.less',
			'assets/less/' + _s.slugify(prompts.customerName) + '/scaffolding.less',
			'assets/less/' + _s.slugify(prompts.customerName) + '/testResponsiveHelpers.less',
			'assets/less/' + _s.slugify(prompts.customerName) + '/variables.less',

		]);
	});

	it('should have a valid bower.json file', function() {
		JSON.parse(fs.readFileSync('bower.json'));
	});

	it('should have a valid package.json file', function() {
		JSON.parse(fs.readFileSync('package.json'));
	});

	it('should have a valid .jshintrc file', function() {
		JSON.parse(fs.readFileSync('.jshintrc'));
	});

	it('should have a valid .bowerrc file', function() {
		JSON.parse(fs.readFileSync('.bowerrc'));
	});

	it('should not have dependencies to support oldIEs', function() {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		bowerJson.should.not.have.propertyByPath('dependencies', 'html5shiv');
		bowerJson.should.not.have.propertyByPath('dependencies', 'respondJs');
		bowerJson.should.not.have.propertyByPath('dependencies', 'jquery-placeholder');
		bowerJson.should.have.propertyByPath('dependencies', 'jquery').containEql('2.1.3');
	});

	it('should not handle oldIE related files within Grunt tasks', function() {
		assert.noFileContent([
			['Gruntfile.js', /html5shiv/],
			['Gruntfile.js', /respondJs/],
			['Gruntfile.js', /jquery-placeholder/]
		]);
	});

	it('should not reference oldIE related files within HTML files', function() {
		assert.noFileContent([
			['index.html', /html5shiv/],
			['index.html', /respondJs/],
			['index.html', /jquery-placeholder/],
			['stickyFooter.html', /html5shiv/],
			['stickyFooter.html', /respondJs/],
			['stickyFooter.html', /jquery-placeholder/],
			['demoElements.html', /html5shiv/],
			['demoElements.html', /respondJs/],
			['demoElements.html', /jquery-placeholder/]
		]);
	});

	it('should not include »browsehappy« message', function() {
		assert.noFileContent([
			['index.html', /browsehappy/],
			['stickyFooter.html', /browsehappy/],
			['demoElements.html', /browsehappy/]
		]);
	});

	it('should not include conditional classes to address oldIEs', function() {
		assert.noFileContent([
			['index.html', /<html class="(.+)ie(\d+)">/g],
			['stickyFooter.html', /<html class="(.+)ie(\d+)">/g],
			['demoElements.html', /<html class="(.+)ie(\d+)">/g]
		]);
	});

	it('should render project name and description in bower.json', function() {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		bowerJson.should.have.property('name', _s.slugify(prompts.projectName));
		bowerJson.should.have.property('description', prompts.projectDescription);
	});

	it('should render project name and description in package.json', function() {
		var packageJson = JSON.parse(fs.readFileSync('package.json'));
		packageJson.should.have.property('name', _s.slugify(prompts.projectName));
		packageJson.should.have.property('title', _s.titleize(prompts.projectName));
		packageJson.should.have.property('description', prompts.projectDescription);
	});

	it('should render project name and description in README.md', function() {
		var regex = new RegExp(escapeStringRegexp(prompts.projectDescription),'');
		assert.fileContent('README.md', regex);
		regex = new RegExp(escapeStringRegexp(_s.titleize(prompts.projectName)),'');
		assert.fileContent('README.md', regex);
	});

	it('should render project name in HTML files', function() {
		var regex = new RegExp(escapeStringRegexp(_s.titleize(prompts.projectName)),''),
			arg = [
				['index.html', regex],
				['stickyFooter.html', regex],
				['demoElements.html', regex]
			];
		assert.fileContent(arg);
	});

	it('should have the default output paths within the Gruntfile', function() {
		var arg = [
			['Gruntfile.js', /dist/],
			['Gruntfile.js', /docs/],
			['Gruntfile.js', /reports/]
		];
		assert.fileContent(arg);
	});

	it('should have authors name in bower.json, package.json and LICENSE', function() {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json')),
			packageJson = JSON.parse(fs.readFileSync('package.json')),
			regex = new RegExp(escapeStringRegexp(prompts.authorName),'');

		bowerJson.should.have.property('authors').match(regex);
		packageJson.should.have.propertyByPath('author', 'name').eql(prompts.authorName);
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors email in bower.json and package.json', function() {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json')),
			packageJson = JSON.parse(fs.readFileSync('package.json')),
			regex = new RegExp(escapeStringRegexp(prompts.authorMail),'');;

		bowerJson.should.have.property('authors').match(regex);
		packageJson.should.have.propertyByPath('author', 'email').eql(prompts.authorMail);
	});

	it('should have authors URL in package.json and LICENSE', function() {
		var packageJson = JSON.parse(fs.readFileSync('package.json')),
			regex = new RegExp(escapeStringRegexp(prompts.authorUrl),'');

		packageJson.should.have.propertyByPath('author', 'url').eql(prompts.authorUrl);
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', function() {
		var regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''),'');
		assert.fileContent('LICENSE', regex);
	});

	it('should have a MIT LICENSE', function() {
		assert.fileContent('LICENSE', /copy, modify, merge, publish, distribute, sublicense, and\/or sell/);
	});

	it('should have the initial version number in bower.json and package.json', function() {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json')),
			packageJson = JSON.parse(fs.readFileSync('package.json'));
		bowerJson.should.have.property('version', prompts.initialVersion);
		packageJson.should.have.property('version', prompts.initialVersion);
	});

});

describe('bootstrap-kickstart → oldIeSupport', function() {

	// Define prompt answers
	var prompts = {
		projectName: '',
		projectDescription: '',
		customerName: 'My customer',
		oldIeSupport: true,
		customPaths: false
	};

	before(function(done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompt(prompts)

		.on('end', done);
	});

	it('should have a valid bower.json file', function() {
		JSON.parse(fs.readFileSync('bower.json'));
	});

	it('should have dependencies to support oldIEs', function() {
		var bowerJson = JSON.parse(fs.readFileSync('bower.json'));
		bowerJson.should.have.propertyByPath('dependencies', 'html5shiv');
		bowerJson.should.have.propertyByPath('dependencies', 'respondJs');
		bowerJson.should.have.propertyByPath('dependencies', 'jquery-placeholder');
		bowerJson.should.have.propertyByPath('dependencies', 'jquery').containEql('1.11.2');
	});

	it('should handle oldIE related files within Grunt tasks', function() {
		assert.fileContent([
			['Gruntfile.js', /html5shiv/],
			['Gruntfile.js', /respondJs/],
			['Gruntfile.js', /jquery-placeholder/]
		]);
	});

	it('should reference oldIE related files within HTML files', function() {
		assert.fileContent([
			['index.html', /html5shiv/],
			['index.html', /respondJs/],
			['index.html', /jquery-placeholder/],
			['stickyFooter.html', /html5shiv/],
			['stickyFooter.html', /respondJs/],
			['stickyFooter.html', /jquery-placeholder/],
			['demoElements.html', /html5shiv/],
			['demoElements.html', /respondJs/],
			['demoElements.html', /jquery-placeholder/]
		]);
	});

	it('should include »browsehappy« message', function() {
		assert.fileContent([
			['index.html', /browsehappy/],
			['stickyFooter.html', /browsehappy/],
			['demoElements.html', /browsehappy/]
		]);
	});

	it('should include conditional classes to address oldIEs', function() {
		assert.fileContent([
			['index.html', /<html class="(.+)ie(\d+)">/g],
			['stickyFooter.html', /<html class="(.+)ie(\d+)">/g],
			['demoElements.html', /<html class="(.+)ie(\d+)">/g]
		]);
	});

});

describe('bootstrap-kickstart → customPaths', function() {

	// Define prompt answers
	var prompts = {
		projectName: '',
		projectDescription: '',
		customerName: 'My customer',
		oldIeSupport: true,
		customPaths: true,
		distDirectory: 'disty',
		docsDirectory: 'docsy',
		reportsDirectory: 'reportsy',
	};

	before(function(done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompt(prompts)

		.on('end', done);
	});

	it('should have the prompted output paths within the Gruntfile', function() {
		var arg = [
			['Gruntfile.js', new RegExp(escapeStringRegexp(prompts.distDirectory),'')],
			['Gruntfile.js', new RegExp(escapeStringRegexp(prompts.docsDirectory),'')],
			['Gruntfile.js', new RegExp(escapeStringRegexp(prompts.reportsDirectory),'')]
		];
		assert.fileContent(arg);
	});

});

describe('bootstrap-kickstart → No open source license', function() {

	// Define prompt answers
	var prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		customerName: 'My customer',
		oldIeSupport: false,
		customPaths: false,
		authorName: '',
		authorMail: '',
		authorUrl: '',
		license: 'No open source license – All rights reserved'
	};

	before(function(done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompt(prompts)

		.on('end', done);
	});

	it('should have authors name in LICENSE', function() {
		var regex = new RegExp(escapeStringRegexp(prompts.authorName),'');
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors URL in LICENSE', function() {
		var regex = new RegExp(escapeStringRegexp(prompts.authorUrl),'');
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', function() {
		var regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''),'');
		assert.fileContent('LICENSE', regex);
	});

	it('should not have a open source license', function() {
		assert.fileContent('LICENSE', /All rights reserved. It is strictly prohibited to copy, redistribute, republish/);
	});

});

describe('bootstrap-kickstart → Apache License, Version 2.0', function() {

	// Define prompt answers
	var prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		customerName: 'My customer',
		oldIeSupport: false,
		customPaths: false,
		authorName: '',
		authorMail: '',
		authorUrl: '',
		license: 'Apache License, Version 2.0'
	};

	before(function(done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompt(prompts)

		.on('end', done);
	});

	it('should have authors name in LICENSE', function() {
		var regex = new RegExp(escapeStringRegexp(prompts.authorName),'');
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors URL in LICENSE', function() {
		var regex = new RegExp(escapeStringRegexp(prompts.authorUrl),'');
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', function() {
		var regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''),'');
		assert.fileContent('LICENSE', regex);
	});

	it('should have a Apache license', function() {
		assert.fileContent('LICENSE', /Licensed under the Apache License, Version 2.0/);
	});

});

describe('bootstrap-kickstart → GNU General Public License', function() {

	// Define prompt answers
	var prompts = {
		projectName: 'Test this Thingy',
		projectDescription: 'Just a test.',
		customerName: 'My customer',
		oldIeSupport: false,
		customPaths: false,
		authorName: '',
		authorMail: '',
		authorUrl: '',
		license: 'GNU General Public License, version 3 (GPL-3.0)'
	};

	before(function(done) {
		helpers.run(path.join(__dirname, '../app'))

		// Clear the directory and set it as the CWD
		.inDir(path.join(os.tmpdir(), './temp-test'))

		// Mock options passed in
		.withOptions({
			'skip-install': true
		})

		// Mock the prompt answers
		.withPrompt(prompts)

		.on('end', done);
	});

	it('should have authors name in LICENSE', function() {
		var regex = new RegExp(escapeStringRegexp(prompts.authorName),'');
		assert.fileContent('LICENSE', regex);
	});

	it('should have authors URL in LICENSE', function() {
		var regex = new RegExp(escapeStringRegexp(prompts.authorUrl),'');
		assert.fileContent('LICENSE', regex);
	});

	it('should have the current year within the LICENSE', function() {
		var regex = new RegExp(escapeStringRegexp(new Date().getFullYear() + ''),'');
		assert.fileContent('LICENSE', regex);
	});

	it('should have a GNU General Public License', function() {
		assert.fileContent('LICENSE', /GNU General Public License/);
	});

});
