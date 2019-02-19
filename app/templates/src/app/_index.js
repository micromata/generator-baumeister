/**
 * @file  JavaScript entry point of the project
 */

<% if (templateProps.projectType === 'staticSite') { %>// Import the whole Bootstrap JS bundle
import 'bootstrap';

// Or import only what you need to keep your vendor bundle small
// import 'bootstrap/js/dist/util';
// import 'bootstrap/js/dist/dropdown';<% } else { %>import React from 'react';
import ReactDOM from 'react-dom';<% } %>

// Import polyfills
import { applyPolyfills } from './base/polyfills';

// Import methods from the base module
import { consoleErrorFix, ieViewportFix } from './base/base';

// Import our Sass entrypoint to create the CSS app bundle
import '../assets/scss/index.scss';

<% if (templateProps.projectType === 'staticSite') { %>$(async () => {
	// Wait with further execution until needed polyfills are loaded.
	await applyPolyfills();

	consoleErrorFix();
	ieViewportFix();

	console.log('YaY, my first ES6-Module !!!!');
});
<% } else { %>(async () => {
	// Wait with further execution until needed polyfills are loaded.
	await applyPolyfills();

	consoleErrorFix();
	ieViewportFix();

	function HelloWorld() {
		return <h1>Hello World!</h1>;
	}

	ReactDOM.render(
		<HelloWorld/>,
		document.getElementById('root')
	);

})().catch(err => {
	console.error(err);
});<% } %>
