(function universalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function () {
	"use strict";

	var exports = {
		popup: popup,
		popupWithPost: popupWithPost,
		popupResponse: popupResponse,
	};

	var defaultOptions = {
		width: 700,
		height: 520,
		menubar: 'no',
		resizable: 'yes',
		location: 'yes',
		scrollbars: 'no',
		centered: true,
	};

	var popupCount = 1;

	function optionsToString (options) {
		var arr = [];
		for (var key in options) {
			arr.push(key + '=' + options[key]);
		}
		return arr.join();
	}

	function defaultPopupName () {
		return 'Popup ' + (popupCount++);
	}

	function getCenterOffset (width, height) {
		return {
			left: Math.round(window.screenX + ((window.outerWidth - width) / 2)),
			top: Math.round(window.screenY + ((window.outerHeight - height) / 2.5)),
		};
	}

	function assign (target, firstSource) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) {
				target[key] = source[key];
			}
	  	}

		return target;
	}

	function openPopupWithPost (url, postData, name, options) {
		var form = document.createElement('form');

		form.setAttribute('method', 'post');
		form.setAttribute('action', url);
		form.setAttribute('target', name);

		for (var itemName in postData) {
			var input = document.createElement('input');
			input.type = 'hidden';
			input.name = itemName;
			input.value = postData[itemName];
			form.appendChild(input);
		}

		document.body.appendChild(form);

		var win = window.open('about:blank', name, options);
		win.document.write('Loading...');

		form.submit();
		document.body.removeChild(form);

		return win;
	}

	function popupExecute (execute, url, name, options, callback) {
		name = name || defaultPopupName();
		options = assign({ }, defaultOptions, options);
		callback = callback || function () {};

		if (options.centered) {
			options = assign(getCenterOffset(options.width, options.height), options);
			delete options.centered;
		}

		var optionsString = optionsToString(options);
		var win = execute(url, name, optionsString);
		var isMessageSent = false;

		var onMessage = function (message) {
			var data = message ? message.data : undefined;

			if (data) {
				isMessageSent = true;
				window.removeEventListener('message', onMessage);
				callback(undefined, data);
			}
		};

		window.addEventListener('message', onMessage, false);

		if (win) {
			var interval = setInterval(function () {
				if (win == null || win.closed) {
					clearInterval(interval);
					if (!isMessageSent) {
						callback(new Error('Popup closed'));
					}
				}
			}, 100);
		} else {
			callback(new Error('Popup blocked'));
		}

	}

	function popup (url, name, options, callback) {
		return popupExecute(window.open, url, name, options, callback);
	}

	function popupWithPost (url, postData, name, options, callback) {
		const execute = function (url, name, options) {
			return openPopupWithPost(url, postData, name, options);
		};

		return popupExecute(execute, url, name, options, callback);
	}

	function popupResponse (data) {
		var jsonData = JSON.stringify(data);

		return '<script>' +
			'window.opener.postMessage(' + jsonData + ', "*");' +
			'setTimeout(function() { window.close(); }, 50);' +
		'</script>';
	}

	return exports;
});
