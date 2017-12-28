var http = require('http'),
		path = require('path'),
		morgan = require('morgan'),
		express= require('express'),
		bodyParser = require('body-parser'),
		session = require('express-session'),
		cors = require('cors'),
		passport = require('passport'),
		methods = require('methods'),
		methodOverride= require('method-override'),
		errorhandler = require('errorhandler'),
		mongoose = require('mongoose');

var routes = require('../routes');

var {isProd} = require('./envs.js');

module.exports = function(app){
	app.use(cors());
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	app.use(express.static(__dirname+'/public'));
	app.use(session(
		{
		secret:'conduit',
		cookie:{maxAge:60000}, 
		resave:true,
		saveUninitialized:false
	}));

	if(!isProd){
		app.use(errorhandler())
	}

	return app;
}