const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const popupResponse = require('../../src/PopupTools').popupResponse;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/src', express.static('../../src'));

app.post('/response', function (req, res) {
	res.send(popupResponse({ msg1: 'Responded Successfully' }));
});

app.post('/post', function (req, res) {
	res.send('<html><body><h1>' + JSON.stringify(req.body) + '</h1></body></html>');
});

app.listen(8080, function () {
	console.log('Example app listening on port 8080!');
});