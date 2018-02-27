const chalk = require('chalk');
const semver = require('semver');

// Define chalk styles
const error = chalk.red;

const helper = {};

helper.validateSemverVersion = function (value) {
	if (semver.valid(value)) {
		return true;
	}
	return error('Please enter a valid semver version, i.e. MAJOR.MINOR.PATCH. See → https://nodesource.com/blog/semver-a-primer/');
};

helper.defaultIssueTracker = function (answers) {
	const regex = /(?:git@|https:\/\/)(github.com)(?::|\/{1})(.+).git/ig;

	if (answers.projectRepository.match(regex) !== null) {
		return answers.projectRepository.replace(regex, 'https://$1/$2/issues');
	}
	return '';
};

helper.filterProjectType = function (answer) {
	if (answer === 'A static website (Static site generator using Handlebars and Frontmatters)') {
		return 'staticSite';
	}
	return 'spa';
};

helper.filterBoilerplateAmount = function (answer) {
	if (answer === 'Just a little – Get started with a few example files') {
		return 'little';
	}
	return 'minimum';
};

module.exports = helper;
