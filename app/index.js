'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

// Define error style
var error = chalk.red;

module.exports = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../package.json');
	},

	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the epic ' + chalk.yellow('Bootstrap Kickstart') + ' generator!'
		));

		var prompts = [
			{
				type: 'input',
				name: 'projectName',
				message: 'What’s the name of your project?',
				default : this._.titleize(this.appname)  // Default to current folder name
			},
			{
				type: 'input',
				name: 'projectDescription',
				message: 'A short description of your project:'
			},
			{
				type: 'input',
				name: 'customerName',
				message: 'What would you like to name your »customer-theme« in the less-files?',
				// default : this._.slugify(this.appname),
				// default : 'customerName',
				validate: function(value) {

					if (value === '') {
						return error('Oops. This is used to name a file and a directory and can’t left blank.');
					} else {
						return true;
					}
				}
			},
			{
				type: 'confirm',
				name: 'oldIeSupport',
				message: 'Do you need to support Internet Explorer below IE9?',
				default: false
			}
		];

		this.prompt(prompts, function (props) {
			this.projectName = props.projectName;
			// this.projectName = this._.titleize(props.projectName);
			this.projectDescription = props.projectDescription;
			this.oldIeSupport = props.oldIeSupport;
			this.customerName = this._.slugify(props.customerName);

			// this.log(this.projectName);
			// this.log(this.projectDescription);
			// this.log(this.oldIeSupport);


			done();
		}.bind(this));
	},

	writing: {
		dependencies: function () {
			this.template('_package.json', 'package.json');
			this.template('_bower.json', 'bower.json');
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
			this.template('_index.html', 'index.html');
			this.template('_stickyFooter.html', 'stickyFooter.html');
			this.template('_demoElements.html', 'demoElements.html');

			this.template('_README.md', 'README.md');

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
				this.templatePath('CONTRIBUTING.md'),
				this.destinationPath('CONTRIBUTING.md')
			);
		},

		assets: function (props) {
			this.directory(
				this.templatePath('assets/fonts'),
				this.destinationPath('assets/fonts')
			);
			this.directory(
				this.templatePath('assets/img'),
				this.destinationPath('assets/img')
			);
			this.directory(
				this.templatePath('assets/js'),
				this.destinationPath('assets/js')
			);
			this.fs.copyTpl(
				this.templatePath('assets/less/base.less'),
				this.destinationPath('assets/less/base.less')
			);
			this.fs.copyTpl(
				this.templatePath('assets/less/index.less'),
				this.destinationPath('assets/less/index.less')
			);
			this.fs.copyTpl(
				this.templatePath('assets/less/print.less'),
				this.destinationPath('assets/less/print.less')
			);
			this.fs.copyTpl(
				this.templatePath('assets/less/_customerName.less'),
				this.destinationPath('assets/less/' + this.customerName + '.less')
			);
			this.fs.copyTpl(
				this.templatePath('assets/less/_customerName/alerts.less'),
				this.destinationPath('assets/less/' + this.customerName + '/alerts.less')
			);

			this.fs.copyTpl(
				this.templatePath('assets/less/_customerName/demoElements.less'),
				this.destinationPath('assets/less/' + this.customerName + '/demoElements.less')
			);

			this.fs.copyTpl(
				this.templatePath('assets/less/_customerName/footer.less'),
				this.destinationPath('assets/less/' + this.customerName + '/footer.less')
			);

			this.fs.copyTpl(
				this.templatePath('assets/less/_customerName/mixins.less'),
				this.destinationPath('assets/less/' + this.customerName + '/mixins.less')
			);

			this.fs.copyTpl(
				this.templatePath('assets/less/_customerName/ribbon.less'),
				this.destinationPath('assets/less/' + this.customerName + '/ribbon.less')
			);

			this.fs.copyTpl(
				this.templatePath('assets/less/_customerName/scaffolding.less'),
				this.destinationPath('assets/less/' + this.customerName + '/scaffolding.less')
			);

			this.fs.copyTpl(
				this.templatePath('assets/less/_customerName/testResponsiveHelpers.less'),
				this.destinationPath('assets/less/' + this.customerName + '/testResponsiveHelpers.less')
			);

			this.fs.copyTpl(
				this.templatePath('assets/less/_customerName/variables.less'),
				this.destinationPath('assets/less/' + this.customerName + '/variables.less')
			);

			// this.log('Done with the assets');
		}

	},

	install: function () {
		// this.log('install-1');
		this.installDependencies({
			// skipInstall: this.options['skip-install']
			skipInstall: true
		});
		// this.log('install');
	},

	end: function () {
		// this.log('end');
		// this.log(this.projectName);
		// this.log(this.projectNameDashed);
		// this.log(this.oldIeSupport);
	}
});
