'use strict';

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

function optionsToString(options) {
    return Object
        .keys(options)
        .map(function processOption(key) {
            return key + '=' + options[key];
        })
        .join(',');
}

function defaultPopupName() {
    popupCount += 1;
    return 'Popup ' + (popupCount);
}

function optionsResolveCentered(options) {
    var result = options;
    if (options.centered) {
        result.left = Math.round(window.screenX + ((window.outerWidth - options.width) / 2));
        result.top = Math.round(window.screenY + ((window.outerHeight - options.height) / 2.5));
        delete result.centered;
    }
    return result;
}

function assign(target) {
    var sources = Array.prototype.slice.call(arguments, 1);

    function assignArgument(previous, source) {
        Object
            .keys(source)
            .forEach(function assignItem(key) {
                previous[key] = source[key];  // eslint-disable-line no-param-reassign
            });

        return previous;
    }

    return sources.reduce(assignArgument, target);
}

function openPopupWithPost(url, postData, name, options) {
    var form = document.createElement('form');
    var win;

    form.setAttribute('method', 'post');
    form.setAttribute('action', url);
    form.setAttribute('target', name);

    Object
        .keys(postData)
        .forEach(function addFormItem(key) {
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = postData[key];
            form.appendChild(input);
        });

    document.body.appendChild(form);

    win = window.open('about:blank', name, options);
    win.document.write('Loading...');

    form.submit();
    document.body.removeChild(form);

    return win;
}

function popupExecute(execute, url, name, options, callback) {
    var popupName = name || defaultPopupName();
    var popupOptions = optionsResolveCentered(assign({ }, defaultOptions, options));
    var popupCallback = callback || function noop() {};
    var optionsString = optionsToString(popupOptions);
    var win = execute(url, popupName, optionsString);
    var isMessageSent = false;
    var interval;

    function onMessage(message) {
        var data = message ? message.data : undefined;

        if (data) {
            isMessageSent = true;
            window.removeEventListener('message', onMessage);
            popupCallback(undefined, data);
        }
    }

    window.addEventListener('message', onMessage, false);

    if (win) {
        interval = setInterval(function closePopupCallback() {
            if (win == null || win.closed) {
                clearInterval(interval);
                if (!isMessageSent) {
                    popupCallback(new Error('Popup closed'));
                }
            }
        }, 100);
    } else {
        popupCallback(new Error('Popup blocked'));
    }
}

function popup(url, name, options, callback) {
    return popupExecute(window.open, url, name, options, callback);
}

function popupWithPost(url, postData, name, options, callback) {
    function openWithPostData(popupUrl, popupName, optionsString) {
        return openPopupWithPost(popupUrl, postData, popupName, optionsString);
    }

    return popupExecute(openWithPostData, url, name, options, callback);
}

function popupResponse(data) {
    var jsonData = JSON.stringify(data);

    return '<script>' +
        'window.opener.postMessage(' + jsonData + ', "*");' +
        'setTimeout(function() { window.close(); }, 50);' +
    '</script>';
}

return {
    popup: popup,
    popupWithPost: popupWithPost,
    popupResponse: popupResponse,
};
