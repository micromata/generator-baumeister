[![npm version](https://badge.fury.io/js/generator-bootstrap-kickstart.svg)](http://badge.fury.io/js/generator-bootstrap-kickstart) [![Build Status](https://travis-ci.org/micromata/generator-bootstrap-kickstart.svg)](https://travis-ci.org/micromata/generator-bootstrap-kickstart) [![devDependency Status](https://david-dm.org/micromata/generator-bootstrap-kickstart/dev-status.svg)](https://david-dm.org/micromata/generator-bootstrap-kickstart#info=devDependencies)  [![Dependency Status](https://david-dm.org/micromata/generator-bootstrap-kickstart/status.svg)](https://david-dm.org/micromata/generator-bootstrap-kickstart#info=Dependencies) [![peerDependency Status](https://david-dm.org/micromata/generator-bootstrap-kickstart/peer-status.svg)](https://david-dm.org/micromata/generator-bootstrap-kickstart#info=peerDependencies) [![Twitter](https://img.shields.io/badge/Twitter-%40BootstrapKick%20-blue.svg?style=flat)](https://twitter.com/BootstrapKick) [![Unicorn](https://img.shields.io/badge/unicorn-approved-ff69b4.svg?style=flat)](https://www.youtube.com/watch?v=Sm368W0OsHo) 




#Yeoman Generator for »Bootstrap Kickstart«


    	 _-----_
	    |       |    .--------------------------.
	    |--(o)--|    |   Yeoman Generator for   |
	   `---------´   |   »Bootstrap Kickstart«  |
	    ( _´U`_ )    '--------------------------'
	    /___A___\    
	     |  ~  |     
	   __'.___.'__   
	 ´   `  |° ´ Y ` 



Using this generator will give you a solid base for your Bootstrap based project in a matter of minutes. It will offer you some neat options for using »Bootstrap Kickstart« which will help you with the creation of Bootstrap themes and sites by providing a file structure with focus on maintainibilty and upgradability and a set of useful Grunt Tasks. 

Please check the epic [README](https://github.com/micromata/bootstrap-kickstart) of »Bootstrap Kickstart« to get detailed information about what it’s all about.

## Features of this generator

There are tons of options for now :scream:  
… but dont be afraid – most of them are optional and you even get to see them all because some are depending on others.

| Option  | Description |
| ------------- | ------------- |
| `oldIeSupport`  | Whether to make use of »html5shiv«, »respondJs« and »jquery-placeholder« and conditional classes  |
| `projectName` | Used in the generated README, package.json and bower.json  |
| `projectDescription`  | Used in the generated Readme.md, package.json and bower.json  |
| `customerName`  | Used to name a file and a folder within the LESS directory  |
| `customPaths`  | Option to define the output paths `dist`, `docs`, `reports`  |
| `boilerplateAmount`  | Option to choose the amount of boilerplate code (HTML, LESS and JS examples)  |
| `license`  | Option to define the license type. Defaults to MIT  |
| `initialVersion`  | Option to define the initial version number used in generated package.json and bower.json. Defaults to 0.0.0  |
| `authorName`  | Option to define the author for use in the generated package.json, bower.json and JavaScript files  |
| `authorMail`  | Option to define the author for use in the generated package.json, bower.json and JavaScript files  |
| `authorUrl`  | Option to define the author for use in the generated package.json and bower.json files |
| `projectHomepage`, `projectRepositoryType`, `projectRepository`  | option to define homepage and repository for use in the generated package.json and bower.json files  |
| `issueTracker`  | option to define the URL to your issue tracker for use in the generated package.json and bower.json files  |

The following might be added later:

- [ ] Options to include additional files from HTML5 Boilerplate [#13](https://github.com/micromata/generator-bootstrap-kickstart/issues/13)
	- Feedback appreciated.

---


## Quick install guide

For those already using Yeoman.

```bash
npm install -g generator-bootstrap-kickstart
yo bootstrap-kickstart
```
---

## Dependencies

- Node.js
- Bower
- Grunt

See detailed installation instructions [over here](https://github.com/micromata/bootstrap-kickstart#dependencies) if you are new to this.

## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

[![Yeoman Logo](yeoman.png "Yeoman Logo")](http://yeoman.io/)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-bootstrap-kickstart from npm, run:

```bash
npm install -g generator-bootstrap-kickstart
```

Finally, initiate the generator:

```bash
yo bootstrap-kickstart
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)

## License

Please be aware of the licenses of the components we use in this project.
Everything else that has been developed by the contributions to this project is under [MIT License](LICENSE).
