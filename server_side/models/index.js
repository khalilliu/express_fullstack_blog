var mongoose = require('mongoose');

var db = require('../config/db');

db(mongoose);

var User = require('./models/User');
var Article = require('./models/Article');
var Comment = require('./models/Comment');

module.export = {User,Article,Comment};