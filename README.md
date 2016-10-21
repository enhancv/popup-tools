# express-braintree-webhooks
[![Build Status](https://travis-ci.org/enhancv/popup-tools.svg?branch=master)](https://travis-ci.org/enhancv/popup-tools)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/55a5fbd27a854788942d5643daf090ff)](https://www.codacy.com/app/ivank/popup-tools?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=enhancv/popup-tools&amp;utm_campaign=Badge_Grade)

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
}));
```

## License
Copyright (c) 2016 Enhancv
Licensed under the MIT license.