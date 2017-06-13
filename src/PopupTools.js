"use strict";

var defaultOptions = {
    width: 700,
    height: 520,
    menubar: "no",
    resizable: "yes",
    location: "yes",
    scrollbars: "no",
    centered: true,
};

var popupCount = 1;

/**
 * Return options converted to a string
 *
 * @param  {Object} options
 * @return {String}
 */
function optionsToString(options) {
    return Object.keys(options)
        .map(function processOption(key) {
            return key + "=" + options[key];
        })
        .join(",");
}

/**
 * Get a unique name on each call
 * @return {String}
 */
function defaultPopupName() {
    popupCount += 1;
    return "Popup " + popupCount;
}

/**
 * Convert "centered: true" key into concrete left and top arguments
 * Both can be overwritten
 *
 * @param  {Object} options
 * @return {Object}
 */
function optionsResolveCentered(options) {
    var result = options;
    var width = window.outerWidth - options.width;
    var height = window.outerHeight - options.height;

    if (options.centered) {
        result.left = options.left || Math.round(window.screenX + width / 2);
        result.top = options.top || Math.round(window.screenY + height / 2.5);
        delete result.centered;
    }
    return result;
}

/**
 * Polyfill Object.assign
 *
 * @param  {Object} target
 * @param  {Object} source1 ...
 * @return {Object}
 */
function assign(target) {
    var sources = Array.prototype.slice.call(arguments, 1);

    function assignArgument(previous, source) {
        Object.keys(source).forEach(function assignItem(key) {
            previous[key] = source[key]; // eslint-disable-line no-param-reassign
        });

        return previous;
    }

    return sources.reduce(assignArgument, target);
}

/**
 * Create a form element, add hidden inputs for all the post data
 * and post it into a newly opened popup
 *
 * @param  {String} url
 * @param  {Object} postData
 * @param  {String} name
 * @param  {Object} options
 * @return {Object}
 */
function openPopupWithPost(url, postData, name, options) {
    var form = document.createElement("form");
    var win;

    form.setAttribute("method", "post");
    form.setAttribute("action", url);
    form.setAttribute("target", name);

    Object.keys(postData).forEach(function addFormItem(key) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = postData[key];
        form.appendChild(input);
    });

    document.body.appendChild(form);

    win = window.open("/", name, options);
    win.document.write("Loading...");

    form.submit();
    document.body.removeChild(form);

    return win;
}

/**
 * Open a popup using the first argument. Wait for it to close.
 * Returns the window object
 *
 * @param  {Function}
 * @param  {String}
 * @param  {String}
 * @param  {Object}
 * @param  {Function}
 * @return {Object}
 */
function popupExecute(execute, url, name, options, callback) {
    var popupName = name || defaultPopupName();
    var popupOptions = optionsResolveCentered(assign({}, defaultOptions, options));
    var popupCallback = callback || function noop() {};
    var optionsString = optionsToString(popupOptions);
    var win = execute(url, popupName, optionsString);
    var isMessageSent = false;
    var interval;

    function popupCallbackOnce(err, data) {
        if (!isMessageSent) {
            isMessageSent = true;
            popupCallback(err, data);
        }
    }

    function onMessage(message) {
        var data = message ? message.data : undefined;

        if (data) {
            popupCallbackOnce(undefined, data);
            window.removeEventListener("message", onMessage);
        }
    }

    window.addEventListener("message", onMessage, false);

    if (win) {
        interval = setInterval(function closePopupCallback() {
            if (win == null || win.closed) {
                setTimeout(function delayWindowClosing() {
                    clearInterval(interval);
                    popupCallbackOnce(new Error("Popup closed"));
                }, 500);
            }
        }, 100);
    } else {
        popupCallbackOnce(new Error("Popup blocked"));
    }

    return win;
}

/**
 * Open a popup using the first argument.
 * Wait for it to close and call the callback.
 * Set the options string using the options object
 * Returns the window object
 *
 * @param  {String} url
 * @param  {String} name
 * @param  {Object} options
 * @param  {Function} callback
 * @return {Object}
 */
function popup(url, name, options, callback) {
    return popupExecute(window.open, url, name, options, callback);
}

/**
 * Open a popup using the first argument.
 * Post the data into the open popup.
 * Wait for it to close and call the callback.
 * Set the options string using the options object
 * Returns the window object
 *
 * @param  {String} url
 * @param  {Object} postData
 * @param  {String} name
 * @param  {Object} options
 * @param  {Function} callback
 * @return {Object}
 */
function popupWithPost(url, postData, name, options, callback) {
    function openWithPostData(popupUrl, popupName, optionsString) {
        return openPopupWithPost(popupUrl, postData, popupName, optionsString);
    }

    return popupExecute(openWithPostData, url, name, options, callback);
}

/**
 * Return html that when executed, will trigger the popup to callback with a response
 *
 * @param  {Object}
 * @return {String}
 */
function popupResponse(data) {
    var jsonData = JSON.stringify(data);

    return (
        "<script>" +
        "window.opener.postMessage(" +
        jsonData +
        ', "*");' +
        "setTimeout(function() { window.close(); }, 50);" +
        "</script>"
    );
}

return {
    popup: popup,
    popupWithPost: popupWithPost,
    popupResponse: popupResponse,
};
