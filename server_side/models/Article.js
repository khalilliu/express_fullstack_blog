var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var jwt = require('jsonwebstoken');
var slug = require('slug');
var secret = require('../config/envs').secret;
var User = mongoose.model('User');

var ArticleSchema = new mongoose.Schema({
	slug:{
		type: String, 
		lowcase:true,
		unique:true
	},
	title:String,
	description:String,
	body:String,
	favoritesCount:{
		type:Number,
		default:0
	},
	comments:[{
		type: mongoose.Schema.Types.ObjectId,
		ref:'Comment'
	}],
	tagList:[{
		type:String
	}],
	author:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	}
},{timestamps: true})

ArticleSchema.plugin(uniqueValidator, {message: 'is already taken'});

ArticleSchema.pre('validator',function(next){
	if(!this.slug){
		this.slugify();
	}
	next();
})

ArticleSchema.methods.slugify = function(){
	this.slug = slug(this.title)+'-'+(Math.random()*Math.pow(36,6)|0).toString(36);
}

ArticleSchema.methods.updateFavoriteCount = function(){
	var article = this;
	return User.count({favorites: {$in:[article._id]}})
		.then(function(count){
			
		})
}

module.exports = mongoose.model('Article', ArticleSchema);
