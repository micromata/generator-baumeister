/**
 * @file An example module extending the the functionality of Bootstraps »Foo«
 * module or an own module which has nothing to do with Bootstraps JavaScript
 * code.
 * @author <%= authorName %> <<%= authorMail %>>
 */

/**
 * Make sure our global object is available.
 * @namespace <%= _.camelize(_.slugify(projectName)) %>
 * @ignore
 */
var <%= _.camelize(_.slugify(projectName)) %> = window.<%= _.camelize(_.slugify(projectName)) %> || {};

/**
 * Namespace of the module.
 * Aliasing the jQuery Namespace via Self Invoking Anonymous Function.
 * @namespace modulName
 * @memberof <%= _.camelize(_.slugify(projectName)) %>
 * @param 	{jQuery} $	passing the jQuery object to make $ available even when
 *                    	using jQuery.noConflict()
 */
<%= _.camelize(_.slugify(projectName)) %>.modulName = (function($) {
	'use strict';

	/**
	 * Just an example public method that you could call from the global scope.
	 * @memberof <%= _.camelize(_.slugify(projectName)) %>.modulName
	 * @public
	 * @param {string} message Message to write into the console.
	 * @example
	 * <%= _.camelize(_.slugify(projectName)) %>.modulName.yourPublicMethod('Hi Public.');
	 */
	var yourPublicMethod = function(message) {
		console.info(message);
	};

	/**
	 * Just an example private method that you only can call from within this
	 * module.
	 * @memberof <%= _.camelize(_.slugify(projectName)) %>.modulName
	 * @private
	 * @param {string} message Message to write into the console.
	 */
	var _yourPrivateMethod = function(message) {
		console.info(message);
	};

	/**
	 * Executed on DOM ready within the scope of this module.
	 * @event
	 */
	$(function() {
		_yourPrivateMethod('Hi Private.');
	});

	// Return functions to make them accessible from outside.
	return {
		yourPublicMethod: yourPublicMethod
	};

}(jQuery));

/**
 * Executed on DOM ready within the global scope.
 * @event
 */
$(function() {
	'use strict';

	<%= _.camelize(_.slugify(projectName)) %>.modulName.yourPublicMethod('Hi public.');
});


