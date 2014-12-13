'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var _s = require('underscore.string');

describe('bootstrap-kickstart:default', function() {
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

	it('creates package manager files', function() {
		assert.file([
			'bower.json',
			'package.json'
		]);
	});

	it('creates dot files', function() {
		assert.file([
			'.bowerrc',
			'.editorconfig',
			'.gitignore',
			'.jshintrc'
		]);
	});

	it('creates project files', function() {
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

	it('creates assets', function() {
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

});
