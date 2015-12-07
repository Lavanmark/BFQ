var express = require('express');
var logger = require('morgan');
var app = express();

// setup static directory
app.use(logger('dev'));
app.use(express.static('app'));

module.exports = app;