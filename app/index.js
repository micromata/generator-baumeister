'use strict';

var yeoman = require('yeoman-generator'),
	chalk = require('chalk'),
	yosay = require('yosay'),
	superb = require('superb');

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
			'Welcome to the ' + superb() + ' ' + chalk.yellow('Bootstrap Kickstart') + ' generator!'
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
		packageManagerFiles: function () {
			this.template('_package.json', 'package.json');
			this.template('_bower.json', 'bower.json');
		},

		dotFiles: function () {
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

		projectFiles: function () {
			this.template('_index.html', 'index.html');
			this.template('_stickyFooter.html', 'stickyFooter.html');
			this.template('_demoElements.html', 'demoElements.html');

			this.template('_README.md', 'README.md');

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

		assets: function () {
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

			this.template('assets/less/_index.less', 'assets/less/index.less');

			this.fs.copyTpl(
				this.templatePath('assets/less/print.less'),
				this.destinationPath('assets/less/print.less')
			);

			this.template('assets/less/_customerName.less', 'assets/less/' + this.customerName + '.less');
			this.template('assets/less/_customerName/_alerts.less', 'assets/less/' + this.customerName + '/alerts.less');
			this.template('assets/less/_customerName/_demoElements.less', 'assets/less/' + this.customerName + '/demoElements.less');
			this.template('assets/less/_customerName/_footer.less', 'assets/less/' + this.customerName + '/footer.less');
			this.template('assets/less/_customerName/_ribbon.less', 'assets/less/' + this.customerName + '/ribbon.less');

			this.fs.copyTpl(
				this.templatePath('assets/less/_customerName/mixins.less'),
				this.destinationPath('assets/less/' + this.customerName + '/mixins.less')
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
			skipInstall: this.options['skip-install']
			// skipInstall: true
		});
		// this.log('install');
	},

	end: function () {
		// this.log('end');
		this.log(yosay(
			chalk.red('That’s it!') + ' You’re all set to begin working with Bootstrap ✌(-‿-)✌\n' +
			'Enter `grunt tasks` to see the available Grunt tasks.'
		));
		//
		// this.log(this.projectName);
		// this.log(this.projectNameDashed);
		// this.log(this.oldIeSupport);
	}
});
