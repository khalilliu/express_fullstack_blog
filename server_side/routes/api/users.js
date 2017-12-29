var router = require('express').Router();
var  mongoose = require('mongoose');
var passport = require('passport');
var {User,Article,Comment} = require('../../models')();
var auth = require('../auth');

router.post('/login',function(req,res,next){
	if(!req.body.user.email){
		return res.status(422).json({errors:{email:"can't be blank"}});
	}
	if(!req.body.user.password){
		return res.status(422).json({errors:{password:"can't be blank"}});
	}

	password.authenticate('local',{session:false},function(err,user,info){
		if(err){return next(err)}
			
		if(user){
			user.token = user.generateJWT();
			return res.json({user: user.toAuthJSON()});
		}else{
			return res.status(422).json(info);
		}
	})
})

module.exports = router;