'use strict';

var yeoman = require('yeoman-generator'),
	chalk = require('chalk'),
	yosay = require('yosay'),
	superb = require('superb'),
	semver = require('semver');

// Define chalk styles
var error = chalk.red,
	info = chalk.yellow.reset;

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
				default: this._.titleize(this.appname)  // Default to current folder name
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
			},
			{
				type: 'list',
				name: 'boilerplateAmount',
				message: 'With how many boilerplate code you like to get started with?',
				choices: [
					'Just a little – Get started with a few example files',
					'Almost nothing - Just the minimum files and folders'
				]
			},
			{
				type: 'confirm',
				name: 'customPaths',
				message: 'Do you like change the default output paths `dist`, `docs`, `reports`?',
				default: false
			},
			{
				type: 'input',
				name: 'distDirectory',
				message: 'Target directory for building production ready files',
				default: 'dist',
				when: function(answers) {
					return answers.customPaths ;
				}
			},
			{
				type: 'input',
				name: 'docsDirectory',
				message: 'Target directory for generating the docs',
				default: 'docs',
				when: function(answers) {
					return answers.customPaths ;
				}
			},
			{
				type: 'input',
				name: 'reportsDirectory',
				message: 'Target directory for generating the reports',
				default: 'reports',
				when: function(answers) {
					return answers.customPaths ;
				}
			},
			{
				type: 'list',
				name: 'license',
				message: 'Choose a license for you project',
				choices: [
					'MIT',
					'Apache License, Version 2.0',
					'GNU GPLv3',
					'All rights reserved'
				]
			},
			{
				type: 'input',
				name: 'authorName',
				message: 'What’s your Name? ' + info('(used in package.json, bower.json and license)')
			},
			{
				type: 'input',
				name: 'authorUrl',
				message: 'What’s the the URL of your website? ' + info('(not the projects website if they differ – used in package.json and License)')
			},
			{
				type: 'input',
				name: 'initialVersion',
				message: 'What initial version should we put in the bower.json and package.json files?',
				default : '0.0.0',
				validate: function(value) {

					if (!semver.valid(value)) {
						return error('Please enter a correct semver version, i.e. MAJOR.MINOR.PATCH. See → http://semver-ftw.org');
					} else {
						return true;
					}
				}
			},
			{
				type: 'confirm',
				name: 'additionalInfo',
				message: 'Do you like to add additional info to bower.json and package.json? ' + info('(email address, projects homepage, repository etc.)'),
				default: true
			},
			{
				type: 'input',
				name: 'authorMail',
				message: 'What’s your email address?',
				when: function(answers) {
					return answers.additionalInfo;
				}
			},
			{
				type: 'input',
				name: 'projectHomepage',
				message: 'What’s URL of your projects homepage?',
				when: function(answers) {
					return answers.additionalInfo;
				}
			},
			{
				type: 'input',
				name: 'projectRepositoryType',
				message: 'What’s the type of your projects repository?',
				default : 'git',
				when: function(answers) {
					return answers.additionalInfo;
				}
			},
			{
				type: 'input',
				name: 'projectRepository',
				message: 'What’s the clone URL of your projects repository?',
				when: function(answers) {
					return answers.additionalInfo;
				}
			},
			{
				type: 'input',
				name: 'issueTracker',
				message: 'What’s the URL of your projects issue tracker?',
				default: function (answers) {
					var regex = /(?:git@|https:\/\/)(github.com)(?::|\/{1})(.+).git/ig;

					if (answers.projectRepository.match(regex) !== null) {
						return answers.projectRepository.replace(regex, 'https://$1/$2/issues');
					}
				},
				when: function(answers) {
					return answers.additionalInfo;
				}
			},
		];

		this.prompt(prompts, function (props) {
			this.projectName = props.projectName;
			this.projectDescription = props.projectDescription;
			this.customerName = this._.slugify(props.customerName);
			this.oldIeSupport = props.oldIeSupport;
			this.distDirectory = props.distDirectory || 'dist';
			this.docsDirectory = props.docsDirectory || 'docs';
			this.reportsDirectory = props.reportsDirectory || 'reports';
			this.authorName = props.authorName;
			this.authorMail = props.authorMail;
			this.authorUrl = props.authorUrl;
			this.year = new Date().getFullYear();
			this.license = props.license;
			this.initialVersion = props.initialVersion;
			this.additionalInfo = props.additionalInfo;
			this.projectHomepage = props.projectHomepage;
			this.projectRepositoryType = props.projectRepositoryType;
			this.projectRepository = props.projectRepository;
			this.issueTracker = props.issueTracker;
			this.boilerplateAmount = props.boilerplateAmount;

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
			switch (this.boilerplateAmount) {
				case 'Just a little – Get started with a few example files':
					this.template('_index-little-boilerplate.html', 'index.html');
					this.template('_demoElements.html', 'demoElements.html');
					this.template('_stickyFooter.html', 'stickyFooter.html');
					break;
				case 'Almost nothing - Just the minimum files and folders':
					this.template('_index-no-boilerplate.html', 'index.html');
					break;
			}

			// 'Just a little – Get started with a few example files',
			// 'Almost nothing - Just the minimum files and folders'

			this.template('_README.md', 'README.md');
			this.template('_Gruntfile.js', 'Gruntfile.js');


			switch (this.license) {
				case 'MIT':
					this.template('_LICENSE-MIT', 'LICENSE');
					break;
				case 'Apache License, Version 2.0':
					this.template('_LICENSE-APACHE-2.0', 'LICENSE');
					break;
				case 'GNU GPLv3':
					this.template('_LICENSE-GNU', 'LICENSE');
					break;
				case 'All rights reserved':
					this.template('_LICENSE-ALL-RIGHTS-RESERVED', 'LICENSE');
					break;
			}

			this.fs.copyTpl(
				this.templatePath('humans.txt'),
				this.destinationPath('humans.txt')
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

			switch (this.boilerplateAmount) {
				case 'Just a little – Get started with a few example files':
					this.template('assets/js/_base.js', 'assets/js/base.js');
					this.template('assets/js/_module.js', 'assets/js/module.js');
					break;
				case 'Almost nothing - Just the minimum files and folders':
					this.template('assets/js/_base.js', 'assets/js/base.js');
					break;
			}

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

			if (this.boilerplateAmount === 'Just a little – Get started with a few example files') {

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
			}

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
