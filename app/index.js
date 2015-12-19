'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var superb = require('superb');
var semver = require('semver');
var _s = require('underscore.string');

// Define chalk styles
var error = chalk.red;
var info = chalk.yellow.reset;

module.exports = yeoman.generators.Base.extend({

	constructor: function () {
		yeoman.generators.Base.apply(this, arguments);

		// This method adds support for a `--yo-rc` flag
		this.option('yo-rc', {
			desc: 'Read and apply options from .yo-rc.json and skip prompting',
			type: 'Boolean',
			defaults: false
		});
	},

	initializing: function () {
		this.pkg = require('../package.json');
		this.skipPrompts = false;

		if (this.options['yo-rc']) {
			var config = this.config.getAll();

			this.log('Read and applied the following config from ' + chalk.yellow('.yo-rc.json:\n'));
			this.log(config);
			this.log('\n');

			this.templateProps = {
				projectName: config.projectName,
				name: _s.slugify(config.projectName),
				title: _s.titleize(config.projectName),
				namespace: _s.camelize(_s.slugify(config.projectName)),
				projectDescription: config.projectDescription,
				theme: _s.slugify(config.theme),
				oldIeSupport: config.oldIeSupport,
				distDirectory: config.distDirectory || 'dist',
				docsDirectory: config.docsDirectory || 'docs',
				reportsDirectory: config.reportsDirectory || 'reports',
				authorName: config.authorName,
				authorMail: config.authorMail,
				authorUrl: config.authorUrl,
				year: new Date().getFullYear(),
				license: config.license,
				initialVersion: config.initialVersion,
				additionalInfo: config.additionalInfo,
				projectHomepage: config.projectHomepage,
				projectRepositoryType: config.projectRepositoryType,
				projectRepository: config.projectRepository,
				addDistToVersionControl: config.addDistToVersionControl,
				issueTracker: config.issueTracker,
				boilerplateAmount: config.boilerplateAmount
			};
			this.skipPrompts = true;
		}
	},

	prompting: function () {
		if (!this.skipPrompts) {
			var done = this.async();

			// Have Yeoman greet the user.
			this.log(yosay(
				'Yozen, welcome to the ' + superb() + ' ' + chalk.yellow('Bootstrap Kickstart') + ' generator!'
			));

			var prompts = [
				{
					type: 'input',
					name: 'projectName',
					message: 'What’s the name of your project?',
					// Default to current folder name
					default: _s.titleize(this.appname)
				},
				{
					type: 'input',
					name: 'projectDescription',
					message: 'A short description of your project:'
				},
				{
					type: 'input',
					name: 'theme',
					message: 'What would you like to name your Bootstrap theme in the less-files?',
					validate: function (value) {
						var returnValue;

						if (value === '') {
							returnValue = error('Oops. This is used to name a file and a directory and can’t left blank.');
						} else {
							returnValue = true;
						}
						return returnValue;
					}
				},
				{
					type: 'confirm',
					name: 'oldIeSupport',
					message: 'Do you need to support Internet Explorer below IE9?',
					default: false,
					store: true
				},
				{
					type: 'list',
					name: 'boilerplateAmount',
					message: 'With how many boilerplate code you like to get started with?',
					choices: [
						'Just a little – Get started with a few example files',
						'Almost nothing - Just the minimum files and folders'
					],
					store: true
				},
				{
					type: 'confirm',
					name: 'customPaths',
					message: 'Do you like change the default output paths `dist`, `docs`, `reports`?',
					default: false,
					store: true
				},
				{
					type: 'input',
					name: 'distDirectory',
					message: 'Target directory for building production ready files',
					default: 'dist',
					when: function (answers) {
						return answers.customPaths;
					},
					store: true
				},
				{
					type: 'input',
					name: 'docsDirectory',
					message: 'Target directory for generating the docs',
					default: 'docs',
					when: function (answers) {
						return answers.customPaths;
					},
					store: true
				},
				{
					type: 'input',
					name: 'reportsDirectory',
					message: 'Target directory for generating the reports',
					default: 'reports',
					when: function (answers) {
						return answers.customPaths;
					},
					store: true
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
					],
					store: true
				},
				{
					type: 'input',
					name: 'authorName',
					message: 'What’s your Name? ' + info('(used in package.json, bower.json and license)'),
					store: true
				},
				{
					type: 'input',
					name: 'authorUrl',
					message: 'What’s the the URL of your website? ' + info('(not the projects website if they differ – used in package.json and License)'),
					store: true
				},
				{
					type: 'input',
					name: 'initialVersion',
					message: 'What initial version should we put in the bower.json and package.json files?',
					default: '0.0.0',
					validate: function (value) {
						var returnValue;

						if (semver.valid(value)) {
							returnValue = true;
						} else {
							returnValue = error('Please enter a correct semver version, i.e. MAJOR.MINOR.PATCH. See → http://semver-ftw.org');
						}
						return returnValue;
					},
					store: true
				},
				{
					type: 'confirm',
					name: 'additionalInfo',
					message: 'Do you like to add additional info to bower.json and package.json? ' + info('(email address, projects homepage, repository etc.)'),
					default: true,
					store: true
				},
				{
					type: 'input',
					name: 'authorMail',
					message: 'What’s your email address?',
					when: function (answers) {
						return answers.additionalInfo;
					},
					store: true
				},
				{
					type: 'input',
					name: 'projectHomepage',
					message: 'What’s URL of your projects homepage?',
					when: function (answers) {
						return answers.additionalInfo;
					}
				},
				{
					type: 'input',
					name: 'projectRepositoryType',
					message: 'What’s the type of your projects repository?',
					default: 'git',
					when: function (answers) {
						return answers.additionalInfo;
					}
				},
				{
					type: 'input',
					name: 'projectRepository',
					message: 'What’s the remote URL of your projects repository?',
					when: function (answers) {
						return answers.additionalInfo;
					}
				},
				{
					type: 'confirm',
					name: 'addDistToVersionControl',
					message: 'Do you like to add your production ready files (`dist` directory) to version control?',
					default: false,
					store: true
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
					when: function (answers) {
						return answers.additionalInfo;
					}
				}
			];

			this.prompt(prompts, function (props) {
				this.templateProps = {
					projectName: props.projectName,
					name: _s.slugify(props.projectName),
					title: _s.titleize(props.projectName),
					namespace: _s.camelize(_s.slugify(props.projectName)),
					projectDescription: props.projectDescription,
					theme: _s.slugify(props.theme),
					oldIeSupport: props.oldIeSupport,
					distDirectory: props.distDirectory || 'dist',
					docsDirectory: props.docsDirectory || 'docs',
					reportsDirectory: props.reportsDirectory || 'reports',
					authorName: props.authorName,
					authorMail: props.authorMail,
					authorUrl: props.authorUrl,
					year: new Date().getFullYear(),
					license: props.license,
					initialVersion: props.initialVersion,
					additionalInfo: props.additionalInfo,
					projectHomepage: props.projectHomepage,
					projectRepositoryType: props.projectRepositoryType,
					projectRepository: props.projectRepository,
					addDistToVersionControl: props.addDistToVersionControl,
					issueTracker: props.issueTracker,
					boilerplateAmount: props.boilerplateAmount
				};

				done();
			}.bind(this));
		}
	},

	writing: {
		packageManagerFiles: function () {
			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json'), {
					templateProps: this.templateProps
				}
			);
			this.fs.copyTpl(
				this.templatePath('_bower.json'),
				this.destinationPath('bower.json'), {
					templateProps: this.templateProps
				}
			);
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
				this.templatePath('eslintrc'),
				this.destinationPath('.eslintrc')
			);
			this.fs.copyTpl(
				this.templatePath('assets/js/eslintrc'),
				this.destinationPath('assets/js/.eslintrc')
			);
			this.fs.copyTpl(
				this.templatePath('bowerrc'),
				this.destinationPath('.bowerrc')
			);
			this.fs.copyTpl(
				this.templatePath('_gitignore'),
				this.destinationPath('.gitignore'), {
					templateProps: this.templateProps
				}
			);
			this.fs.copyTpl(
				this.templatePath('postinstall.js'),
				this.destinationPath('.postinstall.js')
			);
		},

		handlebarsFiles: function () {
			this.fs.copyTpl(
				this.templatePath('templates/_default.hbs'),
				this.destinationPath('templates/default.hbs'), {
					templateProps: this.templateProps
				}
			);
			this.fs.copyTpl(
				this.templatePath('templates/helpers/helpers.js'),
				this.destinationPath('templates/helpers/helpers.js')
			);

			switch (this.templateProps.boilerplateAmount) {
				case 'Just a little – Get started with a few example files':
					this.fs.copyTpl(
						this.templatePath('partials/footer.hbs'),
						this.destinationPath('partials/footer.hbs')
					);
					this.fs.copyTpl(
						this.templatePath('partials/navbar.hbs'),
						this.destinationPath('partials/navbar.hbs')
					);
					this.fs.copyTpl(
						this.templatePath('_index-little-boilerplate.hbs'),
						this.destinationPath('index.hbs')
					);
					this.fs.copyTpl(
						this.templatePath('_demoElements.hbs'),
						this.destinationPath('demoElements.hbs')
					);
					this.fs.copyTpl(
						this.templatePath('_stickyFooter.hbs'),
						this.destinationPath('stickyFooter.hbs')
					);
					break;
				case 'Almost nothing - Just the minimum files and folders':
					this.fs.copyTpl(
						this.templatePath('partials/gitkeep'),
						this.destinationPath('partials/.gitkeep')
					);
					this.fs.copyTpl(
						this.templatePath('_index-no-boilerplate.hbs'),
						this.destinationPath('index.hbs')
					);
					break;
				default:
					break;
			}

		},

		projectFiles: function () {
			this.fs.copyTpl(
				this.templatePath('_README.md'),
				this.destinationPath('README.md'), {
					templateProps: this.templateProps
				}
			);
			this.fs.copyTpl(
				this.templatePath('_Gruntfile.js'),
				this.destinationPath('Gruntfile.js'), {
					templateProps: this.templateProps
				}
			);

			switch (this.templateProps.license) {
				case 'MIT':
					this.fs.copyTpl(
						this.templatePath('_LICENSE-MIT'),
						this.destinationPath('LICENSE'), {
							templateProps: this.templateProps
						}
					);
					break;
				case 'Apache License, Version 2.0':
					this.fs.copyTpl(
						this.templatePath('_LICENSE-APACHE-2.0'),
						this.destinationPath('LICENSE'), {
							templateProps: this.templateProps
						}
					);
					break;
				case 'GNU GPLv3':
					this.fs.copyTpl(
						this.templatePath('_LICENSE-GNU'),
						this.destinationPath('LICENSE'), {
							templateProps: this.templateProps
						}
					);
					break;
				case 'All rights reserved':
					this.fs.copyTpl(
						this.templatePath('_LICENSE-ALL-RIGHTS-RESERVED'),
						this.destinationPath('LICENSE'), {
							templateProps: this.templateProps
						}
					);
					break;
				default:
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

			switch (this.templateProps.boilerplateAmount) {
				case 'Just a little – Get started with a few example files':
					this.fs.copyTpl(
						this.templatePath('assets/js/_base.js'),
						this.destinationPath('assets/js/base.js'), {
							templateProps: this.templateProps
						}
					);
					this.fs.copyTpl(
						this.templatePath('assets/js/_moduleSkeleton.js'),
						this.destinationPath('assets/js/moduleSkeleton.js'), {
							templateProps: this.templateProps
						}
					);
					break;
				case 'Almost nothing - Just the minimum files and folders':
					this.fs.copyTpl(
						this.templatePath('assets/js/_base.js'),
						this.destinationPath('assets/js/base.js'), {
							templateProps: this.templateProps
						}
					);
					break;
				default:
					break;
			}

			this.fs.copyTpl(
				this.templatePath('assets/less/base.less'),
				this.destinationPath('assets/less/base.less')
			);

			this.fs.copyTpl(
				this.templatePath('assets/less/_index.less'),
				this.destinationPath('assets/less/index.less'), {
					templateProps: this.templateProps
				}
			);

			this.fs.copyTpl(
				this.templatePath('assets/less/print.less'),
				this.destinationPath('assets/less/print.less')
			);

			this.fs.copyTpl(
				this.templatePath('assets/less/_theme.less'),
				this.destinationPath('assets/less/' + this.templateProps.theme + '.less'), {
					templateProps: this.templateProps
				}
			);

			if (this.templateProps.boilerplateAmount === 'Just a little – Get started with a few example files') {

				this.fs.copyTpl(
					this.templatePath('assets/less/_theme/_alerts.less'),
					this.destinationPath('assets/less/' + this.templateProps.theme + '/alerts.less'), {
						templateProps: this.templateProps
					}
				);
				this.fs.copyTpl(
					this.templatePath('assets/less/_theme/_demoElements.less'),
					this.destinationPath('assets/less/' + this.templateProps.theme + '/demoElements.less'), {
						templateProps: this.templateProps
					}
				);
				this.fs.copyTpl(
					this.templatePath('assets/less/_theme/_footer.less'),
					this.destinationPath('assets/less/' + this.templateProps.theme + '/footer.less'), {
						templateProps: this.templateProps
					}
				);
				this.fs.copyTpl(
					this.templatePath('assets/less/_theme/_ribbon.less'),
					this.destinationPath('assets/less/' + this.templateProps.theme + '/ribbon.less'), {
						templateProps: this.templateProps
					}
				);

				this.fs.copyTpl(
					this.templatePath('assets/less/_theme/mixins.less'),
					this.destinationPath('assets/less/' + this.templateProps.theme + '/mixins.less')
				);

				this.fs.copyTpl(
					this.templatePath('assets/less/_theme/scaffolding.less'),
					this.destinationPath('assets/less/' + this.templateProps.theme + '/scaffolding.less')
				);
			}

			this.fs.copyTpl(
				this.templatePath('assets/less/_theme/testResponsiveHelpers.less'),
				this.destinationPath('assets/less/' + this.templateProps.theme + '/testResponsiveHelpers.less')
			);

			this.fs.copyTpl(
				this.templatePath('assets/less/_theme/variables.less'),
				this.destinationPath('assets/less/' + this.templateProps.theme + '/variables.less')
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
