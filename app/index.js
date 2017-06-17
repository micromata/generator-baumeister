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
				projectType: config.projectType || 'A static website (Static site generator using Handlebars and Frontmatters)',
				theme: _s.slugify(config.theme),
				distDirectory: config.distDirectory || 'dist',
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
				banners: config.banners,
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
					type: 'list',
					name: 'projectType',
					message: 'What to you want to build?',
					choices: [
						'A static website (Static site generator using Handlebars and Frontmatters)',
						'A single page application (using plain HTML and the template engine provided by your framework)'
					],
					store: true
				},
				{
					type: 'input',
					name: 'theme',
					message: 'How should your Bootstrap theme be named in the Sass files?',
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
					message: 'Do you like change the default output paths?',
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
					name: 'banners',
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
					projectType: props.projectType,
					theme: _s.slugify(props.theme),
					distDirectory: props.distDirectory || 'dist',
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
					banners: props.banners,
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

		// Tests
		this.fs.copyTpl(
			this.templatePath('src/app/__tests__'),
			this.destinationPath('src/app/__tests__')
		);

		// Gulp related files
		this.fs.copyTpl(
			this.templatePath('gulp/commandLineArgs.js'),
			this.destinationPath('gulp/commandLineArgs.js')
		);
		this.fs.copyTpl(
			this.templatePath('gulp/_config.js'),
			this.destinationPath('gulp/config.js'), {
				templateProps: this.templateProps
			}
		);
		this.fs.copyTpl(
			this.templatePath('gulp/onError.js'),
			this.destinationPath('gulp/onError.js')
		);

		this.fs.copyTpl(
			this.templatePath('gulp/tasks'),
			this.destinationPath('gulp/tasks')
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
			this.templatePath('stylelintrc.json'),
			this.destinationPath('.stylelintrc.json')
		);
		this.fs.copyTpl(
			this.templatePath('_gitignore'),
			this.destinationPath('.gitignore'), {
				templateProps: this.templateProps
			}
		);

		if (this.templateProps.projectType === 'A static website (Static site generator using Handlebars and Frontmatters)') {
			this.fs.copyTpl(
				this.templatePath('src/handlebars/layouts/_default.hbs'),
				this.destinationPath('src/handlebars/layouts/default.hbs'), {
					templateProps: this.templateProps
				}
			);
			this.fs.copyTpl(
				this.templatePath('src/handlebars/helpers/addYear.js'),
				this.destinationPath('src/handlebars/helpers/addYear.js')
			);
		}

		switch (this.templateProps.boilerplateAmount) {
			case 'Just a little – Get started with a few example files':
				if (this.templateProps.projectType === 'A static website (Static site generator using Handlebars and Frontmatters)') {
					this.fs.copyTpl(
						this.templatePath('src/handlebars/partials/footer.hbs'),
						this.destinationPath('src/handlebars/partials/footer.hbs')
					);
					this.fs.copyTpl(
						this.templatePath('src/handlebars/partials/navbar.hbs'),
						this.destinationPath('src/handlebars/partials/navbar.hbs')
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
				} else {
					this.fs.copyTpl(
						this.templatePath('src/_index-little-boilerplate.html'),
						this.destinationPath('src/index.html'), {
							templateProps: this.templateProps
						}
					);
					this.fs.copyTpl(
						this.templatePath('src/_demoElements.html'),
						this.destinationPath('src/demoElements.html'), {
							templateProps: this.templateProps
						}
					);
					this.fs.copyTpl(
						this.templatePath('src/_stickyFooter.html'),
						this.destinationPath('src/stickyFooter.html'), {
							templateProps: this.templateProps
						}
					);
				}
				break;
			case 'Almost nothing - Just the minimum files and folders':
				if (this.templateProps.projectType === 'A static website (Static site generator using Handlebars and Frontmatters)') {
					this.fs.copyTpl(
						this.templatePath('src/handlebars/partials/gitkeep'),
						this.destinationPath('src/handlebars/partials/.gitkeep')
					);
					this.fs.copyTpl(
						this.templatePath('src/index-no-boilerplate.hbs'),
						this.destinationPath('src/index.hbs')
					);
				} else {
					this.fs.copyTpl(
						this.templatePath('src/_index-no-boilerplate.html'),
						this.destinationPath('src/index.html'), {
							templateProps: this.templateProps
						}
					);
				}
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
			this.templatePath('_gulpfile.babel.js'),
			this.destinationPath('gulpfile.babel.js'), {
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
		this.fs.copyTpl(
			this.templatePath('CHANGELOG.md'),
			this.destinationPath('CHANGELOG.md')
		);
		this.fs.copyTpl(
			this.templatePath('_CODE_OF_CONDUCT.md'),
			this.destinationPath('CODE_OF_CONDUCT.md'), {
				templateProps: this.templateProps
			}
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
			this.templatePath('src/assets/scss/_index.scss'),
			this.destinationPath('src/assets/scss/index.scss'), {
				templateProps: this.templateProps
			}
		);
		this.fs.copyTpl(
			this.templatePath('src/assets/scss/_print.scss'),
			this.destinationPath('src/assets/scss/_print.scss')
		);
		this.fs.copyTpl(
			this.templatePath('src/assets/scss/_theme.scss'),
			this.destinationPath('src/assets/scss/_' + this.templateProps.theme + '.scss'), {
				templateProps: this.templateProps
			}
		);

		if (this.templateProps.boilerplateAmount === 'Just a little – Get started with a few example files') {

			this.fs.copyTpl(
				this.templatePath('src/assets/scss/_theme/_alerts.scss'),
				this.destinationPath('src/assets/scss/' + this.templateProps.theme + '/_alerts.scss'), {
					templateProps: this.templateProps
				}
			);
			this.fs.copyTpl(
				this.templatePath('src/assets/scss/_theme/_demoElements.scss'),
				this.destinationPath('src/assets/scss/' + this.templateProps.theme + '/_demoElements.scss'), {
					templateProps: this.templateProps
				}
			);
			this.fs.copyTpl(
				this.templatePath('src/assets/scss/_theme/_footer.scss'),
				this.destinationPath('src/assets/scss/' + this.templateProps.theme + '/_footer.scss'), {
					templateProps: this.templateProps
				}
			);
			this.fs.copyTpl(
				this.templatePath('src/assets/scss/_theme/_mixins.scss'),
				this.destinationPath('src/assets/scss/' + this.templateProps.theme + '/_mixins.scss')
			);

			this.fs.copyTpl(
				this.templatePath('src/assets/scss/_theme/_scaffolding.scss'),
				this.destinationPath('src/assets/scss/' + this.templateProps.theme + '/_scaffolding.scss')
			);
		}

		this.fs.copyTpl(
			this.templatePath('src/assets/scss/_theme/_testResponsiveHelpers.scss'),
			this.destinationPath('src/assets/scss/' + this.templateProps.theme + '/_testResponsiveHelpers.scss')
		);
		this.fs.copyTpl(
			this.templatePath('src/assets/scss/_variables.scss'),
			this.destinationPath('src/assets/scss/_variables.scss')
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
			chalk.red('That’s it!') + ' You’re all set to begin building your stuff ✌(-‿-)✌\n' +
			'Enter `gulp --tasks` to see the available Gulp tasks.'
		));
	}
};
