// JSHint settings

'use strict';

module.exports = function(grunt) {

	// Get devDependencies
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

	// Displays the execution time of grunt tasks
	require('time-grunt')(grunt);

	// Config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		pkpCopy: grunt.file.readJSON('package.json'),

		// jsHint
		jshint: {
			options: {
				reporter: require('jshint-stylish'),
				jshintrc: '.jshintrc',
			},
			all: [
				'Gruntfile.js',
				'app/*.js',
			]
		},

		// mocha
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/**/*.js']
			}
		},

		bump: {
			options: {
				files: ['package.json'],
				updateConfigs: ['pkg'],
				// commit: false,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json', 'CHANGELOG.md'],
				// createTag: false,
				tagName: '%VERSION%',
				tagMessage: 'Version v%VERSION%',
				push: false,
				// pushTo: 'origin',
				// gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
			}
		},

		changelog: {
			release: {
				options: {
					after: '<%= pkpCopy.version %>',
					dest : 'CHANGELOG.md',
					insertType: 'prepend',
					template: '## Version <%= pkg.version %> ({{date}})\n\n{{> features}}',
					featureRegex: /^(.*)$/gim,
					partials: {
						features: '{{#if features}}{{#each features}}{{> feature}}{{/each}}{{else}}{{> empty}}{{/if}}\n',
						feature: '- {{{this}}}\n'
					}
				}
			}
		},

		// watch
		watch: {
			scripts: {
				files: ['app/**/*.js', 'Gruntfile.js'],
				tasks: ['newer:jshint'],
				options: {
					spawn: false
				}
			}
		}

	});

	/**
	 * Register own tasks putting together existing ones
	 */

	// Lint files
	grunt.registerTask('lint', ['jshint']
	);

	// Fire tests
	grunt.registerTask('test', ['mochaTest']);

	// Default task
	grunt.registerTask('default',
		[
			'lint',
			'test'
		]
	);

	// Relase tasks
	grunt.registerTask('releasePatch',
		'`grunt releasePatch` bumps version number (0.0.1), creates changelog, commit these changes and tags release.',
		['bump-only:patch', 'changelog', 'bump-commit']
	);
	grunt.registerTask('releaseMinor',
		'`grunt releaseMinor` bumps version number (0.1.0), creates changelog, commit these changes and tags release.',
		['bump-only:minor', 'changelog', 'bump-commit']
	);
	grunt.registerTask('releaseMajor',
		'`grunt releaseMajor` bumps version number (1.0.0), creates changelog, commit these changes and tags release.',
		['bump-only:major', 'changelog', 'bump-commit']
	);

};
