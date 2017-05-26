'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const superb = require('superb');
const semver = require('semver');
const _s = require('underscore.string');

// Define chalk styles
const error = chalk.red;
const info = chalk.yellow.reset;

module.exports = class extends Generator {

	constructor(args, opts) {
		super(args, opts);

		// This method adds support for a `--yo-rc` flag
		this.option('yo-rc', {
			desc: 'Read and apply options from .yo-rc.json and skip prompting',
			type: Boolean,
			defaults: false
		});
	}

	initializing() {
		this.pkg = require('../package.json');
		this.skipPrompts = false;

		if (this.options['yo-rc']) {
			const config = this.config.getAll();

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
				banner: config.banner,
				addDistToVersionControl: config.addDistToVersionControl,
				issueTracker: config.issueTracker,
				boilerplateAmount: config.boilerplateAmount
			};
			this.skipPrompts = true;
		}
	}

	prompting() {
		if (!this.skipPrompts) {

			// Have Yeoman greet the user.
			this.log(yosay(
				'Yo, welcome to the ' + superb() + ' ' + chalk.yellow('Baumeister') + ' generator!'
			));

			const prompts = [
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
					validate(value) {
						let returnValue;

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
					when(answers) {
						return answers.customPaths;
					},
					store: true
				},
				{
					type: 'input',
					name: 'docsDirectory',
					message: 'Target directory for generating the docs',
					default: 'docs',
					when(answers) {
						return answers.customPaths;
					},
					store: true
				},
				{
					type: 'input',
					name: 'reportsDirectory',
					message: 'Target directory for generating the reports',
					default: 'reports',
					when(answers) {
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
					message: 'What’s your Name? ' + info('(used in package.json and license)'),
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
					message: 'Which initial version should we put in the package.json?',
					default: '0.0.0',
					validate(value) {
						let returnValue;

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
					message: 'Do you like to add additional info to package.json? ' + info('(email address, projects homepage, repository etc.)'),
					default: true,
					store: true
				},
				{
					type: 'input',
					name: 'authorMail',
					message: 'What’s your email address?',
					when(answers) {
						return answers.additionalInfo;
					},
					store: true
				},
				{
					type: 'input',
					name: 'projectHomepage',
					message: 'What’s URL of your projects homepage?',
					when(answers) {
						return answers.additionalInfo;
					}
				},
				{
					type: 'input',
					name: 'projectRepositoryType',
					message: 'What’s the type of your projects repository?',
					default: 'git',
					when(answers) {
						return answers.additionalInfo;
					}
				},
				{
					type: 'input',
					name: 'projectRepository',
					message: 'What’s the remote URL of your projects repository?',
					when(answers) {
						return answers.additionalInfo;
					}
				},
				{
					type: 'confirm',
					name: 'banner',
					message: 'Do you like to add comment headers containing meta information to your production files?',
					default: false,
					store: true
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
					default(answers) {
						const regex = /(?:git@|https:\/\/)(github.com)(?::|\/{1})(.+).git/ig;

						if (answers.projectRepository.match(regex) !== null) {
							return answers.projectRepository.replace(regex, 'https://$1/$2/issues');
						}
					},
					when(answers) {
						return answers.additionalInfo;
					}
				}
			];

			return this.prompt(prompts).then(props => {
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
					banner: props.banner,
					addDistToVersionControl: props.addDistToVersionControl,
					issueTracker: props.issueTracker,
					boilerplateAmount: props.boilerplateAmount
				};

			});
		}
	}

	writing() {
		// Packagemanager files
		this.fs.copyTpl(
			this.templatePath('_package.json'),
			this.destinationPath('package.json'), {
				templateProps: this.templateProps
			}
		);

		// Dotfiles
		this.fs.copyTpl(
			this.templatePath('babelrc'),
			this.destinationPath('.babelrc')
		);
		this.fs.copyTpl(
			this.templatePath('travis.yml'),
			this.destinationPath('.travis.yml')
		);
		this.fs.copyTpl(
			this.templatePath('editorconfig'),
			this.destinationPath('.editorconfig')
		);
		this.fs.copyTpl(
			this.templatePath('eslintrc.json'),
			this.destinationPath('.eslintrc.json')
		);
		this.fs.copyTpl(
			this.templatePath('src/app/eslintrc.json'),
			this.destinationPath('src/app/.eslintrc.json')
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

		// Handlebars files
		this.fs.copyTpl(
			this.templatePath('src/templates/_default.hbs'),
			this.destinationPath('src/templates/default.hbs'), {
				templateProps: this.templateProps
			}
		);
		this.fs.copyTpl(
			this.templatePath('src/templates/helpers/helpers.js'),
			this.destinationPath('src/templates/helpers/helpers.js')
		);

		switch (this.templateProps.boilerplateAmount) {
			case 'Just a little – Get started with a few example files':
				this.fs.copyTpl(
					this.templatePath('src/partials/footer.hbs'),
					this.destinationPath('src/partials/footer.hbs')
				);
				this.fs.copyTpl(
					this.templatePath('src/partials/navbar.hbs'),
					this.destinationPath('src/partials/navbar.hbs')
				);
				this.fs.copyTpl(
					this.templatePath('src/index-little-boilerplate.hbs'),
					this.destinationPath('src/index.hbs')
				);
				this.fs.copyTpl(
					this.templatePath('src/demoElements.hbs'),
					this.destinationPath('src/demoElements.hbs')
				);
				this.fs.copyTpl(
					this.templatePath('src/stickyFooter.hbs'),
					this.destinationPath('src/stickyFooter.hbs')
				);
				break;
			case 'Almost nothing - Just the minimum files and folders':
				this.fs.copyTpl(
					this.templatePath('src/partials/gitkeep'),
					this.destinationPath('src/partials/.gitkeep')
				);
				this.fs.copyTpl(
					this.templatePath('src/index-no-boilerplate.hbs'),
					this.destinationPath('src/index.hbs')
				);
				break;
			default:
				break;
		}

		// Project files
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

		// Assets
		this.fs.copy(
			this.templatePath('src/assets/fonts'),
			this.destinationPath('src/assets/fonts')
		);
		this.fs.copy(
			this.templatePath('src/assets/img'),
			this.destinationPath('src/assets/img')
		);
		this.fs.copyTpl(
			this.templatePath('src/app/_base.js'),
			this.destinationPath('src/app/base.js'), {
				templateProps: this.templateProps
			}
		);
		this.fs.copyTpl(
			this.templatePath('src/app/_index.js'),
			this.destinationPath('src/app/index.js'), {
				templateProps: this.templateProps
			}
		);
		this.fs.copyTpl(
			this.templatePath('src/assets/less/base.less'),
			this.destinationPath('src/assets/less/base.less')
		);
		this.fs.copyTpl(
			this.templatePath('src/assets/less/_index.less'),
			this.destinationPath('src/assets/less/index.less'), {
				templateProps: this.templateProps
			}
		);
		this.fs.copyTpl(
			this.templatePath('src/assets/less/print.less'),
			this.destinationPath('src/assets/less/print.less')
		);
		this.fs.copyTpl(
			this.templatePath('src/assets/less/_theme.less'),
			this.destinationPath('src/assets/less/' + this.templateProps.theme + '.less'), {
				templateProps: this.templateProps
			}
		);

		if (this.templateProps.boilerplateAmount === 'Just a little – Get started with a few example files') {

			this.fs.copyTpl(
				this.templatePath('src/assets/less/_theme/_alerts.less'),
				this.destinationPath('src/assets/less/' + this.templateProps.theme + '/alerts.less'), {
					templateProps: this.templateProps
				}
			);
			this.fs.copyTpl(
				this.templatePath('src/assets/less/_theme/_demoElements.less'),
				this.destinationPath('src/assets/less/' + this.templateProps.theme + '/demoElements.less'), {
					templateProps: this.templateProps
				}
			);
			this.fs.copyTpl(
				this.templatePath('src/assets/less/_theme/_footer.less'),
				this.destinationPath('src/assets/less/' + this.templateProps.theme + '/footer.less'), {
					templateProps: this.templateProps
				}
			);
			this.fs.copyTpl(
				this.templatePath('src/assets/less/_theme/_ribbon.less'),
				this.destinationPath('src/assets/less/' + this.templateProps.theme + '/ribbon.less'), {
					templateProps: this.templateProps
				}
			);
			this.fs.copyTpl(
				this.templatePath('src/assets/less/_theme/mixins.less'),
				this.destinationPath('src/assets/less/' + this.templateProps.theme + '/mixins.less')
			);

			this.fs.copyTpl(
				this.templatePath('src/assets/less/_theme/scaffolding.less'),
				this.destinationPath('src/assets/less/' + this.templateProps.theme + '/scaffolding.less')
			);
		}

		this.fs.copyTpl(
			this.templatePath('src/assets/less/_theme/testResponsiveHelpers.less'),
			this.destinationPath('src/assets/less/' + this.templateProps.theme + '/testResponsiveHelpers.less')
		);
		this.fs.copyTpl(
			this.templatePath('src/assets/less/_theme/variables.less'),
			this.destinationPath('src/assets/less/' + this.templateProps.theme + '/variables.less')
		);

	}

	install() {
		this.installDependencies({
			skipInstall: this.options['skip-install'],
			npm: false,
			bower: false,
			yarn: true,
			callback: error => {
				if (error) {
					this.log('… or alternatively run ' + chalk.yellow('npm install') + ' instead.');
				}
			}
		});
	}

	end() {
		this.log(yosay(
			chalk.red('That’s it!') + ' You’re all set to begin working with Bootstrap ✌(-‿-)✌\n' +
			'Enter `grunt tasks` to see the available Grunt tasks.'
		));
	}
};
