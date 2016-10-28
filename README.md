# Popup Tools

Several simple tools to handle popups with callbacks. Posting data to popups as well as receiving data from them.

[![Build Status](https://travis-ci.org/enhancv/popup-tools.svg?branch=master)](https://travis-ci.org/enhancv/popup-tools)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/55a5fbd27a854788942d5643daf090ff)](https://www.codacy.com/app/ivank/popup-tools)
[![Build Status](https://saucelabs.com/buildstatus/popup-tools)](https://saucelabs.com/beta/builds/f8ded43de77249b496634e73d573018f)

## Installation
Install the module with: `npm install popup-tools`, or download the [latast release](https://github.com/enhancv/popup-tools/releases/latest).
Its built with UMD so you can include it with any package manager as well as use it directly in the browser.

## Usage

There are 3 methods in this package

| popup (url, title, options, callback)      | Open a simple popup, and call the callback method on close                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| popupWithPost (url, post, title, callback) | Open a popup and post the data into it. Again wait for callback                                            |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| popupResponse (data)                       | Called on the server as a response to the popup, will trigger the callback to be called with that response |

You can open popup windows, and recieve a callback whenever the window was closed. Options are also passed as an object, and not as a string, as is generally required.

```javascript
var popupTools = require('popup-tools');

popupTools.popup('/popup-url.html', 'My Popup', { width: 400, height: 100 }, function (err) {
    // this executes when closed
}));

popupTools.popupWithPost('/some-form-submit', { data: 'some data' }, 'My Form', { width: 400, height: 100 }, function (err) {
    // this executes when closed
});
```

## Data reponse

You can also send data back from the popup to the server, by calling the `popupResponse` method on the result for the popup page. This will trigger the closing of the popup, as well as sending the data in the callback function.

```javascript

// Server (express)
var popupTools = require('popup-tools');

app.get('/postback', function (req, res) {
    res.send(popupTools.popupResponse({ some_data: 'data' }));
});

// Client
var popupTools = require('popup-tools');

popupTools.popup('/postback', 'My Popup', { width: 400, height: 100 }, function (err, data) {
    // this executes when closed
    if (err) {
        // Closed by user
    } else {
        // Data returned by the server
        console.log(data)
    }
});
```

## License
Copyright (c) 2016 Enhancv
Licensed under the MIT license.