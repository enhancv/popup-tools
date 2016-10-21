# express-braintree-webhooks
[![Build Status](https://travis-ci.org/enhancv/popup-tools.svg?branch=master)](https://travis-ci.org/enhancv/popup-tools)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/55a5fbd27a854788942d5643daf090ff)](https://www.codacy.com/app/ivank/popup-tools)

Tools for handling popups

## Getting Started
Install the module with: `npm install popup-tools`

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

You can also send data back from the popup to the server

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