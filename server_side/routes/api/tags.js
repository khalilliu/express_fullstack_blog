var router = require('express').Router();
var  mongoose = require('mongoose');
var {User,Article,Comment} = require('../../models')();
var auth = require('../auth');

router.get('/',function(req,res,next){
	Article.find().distinct('taglist').then(function(tags){
		return res.json({tags: tags})
	}).catch(next)
})

module.exports = router;