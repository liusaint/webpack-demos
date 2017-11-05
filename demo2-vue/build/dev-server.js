var config = require('../config/');

var path = require('path');
var webpack = require('webpack');
var express = require('express');


var port = config.dev.port;


var app = express();


var uri = 'http://localhost:'+port;

var server = app.listen(port);

app.get('/',function(req,res,next){
	res.send('hello world');
})