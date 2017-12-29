var jwt = require('express-jwt');
var secret = require('../config/envs').secret;

function getTokenFromHeader(req){
	if(req.headers.authorization && req.headers.authorization.split(' ')[0]==="Token" 
			|| req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		return req.headers.authorization.split(' ')[1];
	}

	return null;
}

//middleware
var auth = {
	required: jwt({
		secret:secret,
		userProperty: 'payload',
		getToken: getTokenFromHeader
	}),

	optional: jwt({
		secret:secret,
		userProperty: 'payload',
		credentialsRequired: false,
		getToken: getTokenFromHeader
	}) 
}

module.exports = auth;