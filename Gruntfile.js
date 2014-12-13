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

		// jsHint
		jshint: {
			options: {
				reporter: require('jshint-stylish'),
				jshintrc: '.jshintrc',
			},
			all: [
				'Gruntfile.js',
				'app/**/*.js'
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

};
