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
		oldIeSupport: false
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

});

describe('bootstrap-kickstart → oldIeSupport', function() {

	// Define prompt answers
	var prompts = {
		projectName: '',
		projectDescription: '',
		customerName: 'My customer',
		oldIeSupport: true
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
	});

});
