# express-braintree-webhooks
[![Build Status](https://secure.travis-ci.org/enhancv/express-braintree-webhooks.png?branch=master)](http://travis-ci.org/enhancv/express-braintree-webhooks)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/51878932d920453d87bd1e8600595542)](https://www.codacy.com/app/ivank/express-braintree-webhooks)
[![Codacy Badge](https://api.codacy.com/project/badge/coverage/51878932d920453d87bd1e8600595542)](https://www.codacy.com/app/ivank/express-braintree-webhooks)

Braintree webhooks middleware for express.js

## Getting Started
Install the module with: `npm install express-braintree-webhooks`

```javascript
var webhooks = require('express-braintree-webhooks');
var gateway = braintree.connect({ ... });

app.post(
    'secret path to webhook',
    webhooks(
        gateway,
        {
            check: function (notification) {
                console.log('braintree check');
            },
            subscription_charged_successfully: function (notification) {
                console.log('make it rain! ', notification.subscription.id);
            },
        }
    )
);
```

## Documantation

```javascript
var returns = webhooks(gateway, webhookResponses, options);
```

| Item             | Description                                           |
| -----------------|-------------------------------------------------------|
| gateway          | [Braintree gateway][1]                                |
| webhookResponses | An object with [kind][2] as key and response as value |
| options          | Additional argument to pass to webhook responses      |
| returns          | A function to be passed as express middleware         |

[1]: https://github.com/braintree/braintree_node
[2]: https://developers.braintreepayments.com/reference/general/webhooks/overview

> This middleware does not provide a default url so you'll need to set it up yourself, as this usually involves adding a secret URL

Using the last "options" argument you can pass additional dependancies to your webhook responses to keep your code more testable

## Error handling

On braintree error, missing webhook or an exception inside the webhook response, the "next" method is called with "Error" argument, to pass it to the next middleware (e.g. exception handling middleware)

## Promises

Webhook reponses can also return promises, in which case the "200 Success" response is sent to braintree on fullfilment of the promise. On rejection it is passed to next.


## License
Copyright (c) 2016 Enhancv
Licensed under the MIT license.