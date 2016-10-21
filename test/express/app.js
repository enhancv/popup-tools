/* eslint-disable func-names, no-console */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var popupResponse = require('../../lib/PopupTools').popupResponse;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/lib', express.static(path.resolve(__dirname, '../../lib')));

app.post('/response', function (req, res) {
    res.send(popupResponse({ msg1: 'Responded Successfully' }));
});

app.post('/post', function (req, res) {
    res.send('<html><body><h1>' + JSON.stringify(req.body) + '</h1></body></html>');
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
