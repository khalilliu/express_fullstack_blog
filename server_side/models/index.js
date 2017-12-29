var mongoose = require('mongoose');


var { secret,isProd } = require('../config/envs');

var User = require('./User');
var Article = require('./Article');
var Comment = require('./Comment');

module.exports = function(){
	return {User:User,Article:Article,Comment:Comment}
}


