'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../package.json');
	},

	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the epic ' + chalk.red('Bootstrap Kickstart') + ' generator!'
		));

		var prompts = [{
			type: 'confirm',
			name: 'someOption',
			message: 'I Can Has Cheezburger?',
			default: true
		}];

		this.prompt(prompts, function (props) {
			this.someOption = props.someOption;

			done();
		}.bind(this));
	},

	writing: {
		dependencies: function () {
			this.fs.copyTpl(
				this.templatePath('package.json'),
				this.destinationPath('package.json')
			);
			this.fs.copyTpl(
				this.templatePath('bower.json'),
				this.destinationPath('bower.json')
			);
		},

		dotfiles: function () {
			this.fs.copyTpl(
				this.templatePath('editorconfig'),
				this.destinationPath('.editorconfig')
			);
			this.fs.copyTpl(
				this.templatePath('jshintrc'),
				this.destinationPath('.jshintrc')
			);
			this.fs.copyTpl(
				this.templatePath('bowerrc'),
				this.destinationPath('.bowerrc')
			);
			this.fs.copyTpl(
				this.templatePath('gitignore'),
				this.destinationPath('.gitignore')
			);
		},

		projectfiles: function () {
			this.fs.copyTpl(
				this.templatePath('index.html'),
				this.destinationPath('index.html')
			);
			this.fs.copyTpl(
				this.templatePath('stickyFooter.html'),
				this.destinationPath('stickyFooter.html')
			);
			this.fs.copyTpl(
				this.templatePath('demoElements.html'),
				this.destinationPath('demoElements.html')
			);
			// this.fs.copyTpl(
			// 	this.templatePath('Gruntfile.js'),
			// 	this.destinationPath('Gruntfile.js')
			// );
			this.fs.copy(
				this.templatePath('Gruntfile.js'),
				this.destinationPath('Gruntfile.js')
			);
			this.fs.copyTpl(
				this.templatePath('humans.txt'),
				this.destinationPath('humans.txt')
			);
			this.fs.copyTpl(
				this.templatePath('LICENSE'),
				this.destinationPath('LICENSE')
			);
			this.fs.copyTpl(
				this.templatePath('README.md'),
				this.destinationPath('README.md')
			);
			this.fs.copyTpl(
				this.templatePath('CONTRIBUTING.md'),
				this.destinationPath('CONTRIBUTING.md')
			);
		},

		assets: function () {
			this.directory(
				this.templatePath('assets'),
				this.destinationPath('assets')
			);
		}

	},

	install: function () {
		this.installDependencies({
			skipInstall: this.options['skip-install']
			// skipInstall: true
		});
	}
});
