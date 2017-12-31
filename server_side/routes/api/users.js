var router = require('express').Router();
var  mongoose = require('mongoose');
var passport = require('passport');
var {User,Article,Comment} = require('../../models')();
var auth = require('../auth');

//for dev color
var colors = require('colors')

//'/api/user' get currentUser
router.get('/user',auth.required,function(req,res,next){
	User.findById(req.payload.id).then(function(user){
		if(!user){return res.sendStatus(401)}
		//console.log(colors.red(user));
		return res.json({user: user.toAuthJSON()})
	}).catch(next);
})

//update user
router.put('/user',auth.required,function(req,res,next){
	User.findById(req.payload.id).then(function(user){
		if(!user){return res.sendStatus(401)};

		//only update field that were actually passed
		if(typeof req.body.user.username !== 'undefined'){
			user.username = req.body.user.username;
		}
		if(typeof req.body.user.email !== 'undefined'){
			user.email = req.body.user.email;
		}
		if(typeof req.body.user.bio !== 'undefined'){
			user.bio = req.body.user.bio;
		}
		if(typeof req.body.user.image !== 'undefined'){
			user.image = req.body.user.image;
		}
		if(typeof req.body.user.password !== 'undefined'){
			user.password = req.body.user.password;
		}

		return user.save().then(function(){
			return res.json({user: user.toAuthJSON()});
		})

	}).catch(next);
})

//'/api/users/login'
router.post('/users/login',function(req,res,next){
	if(!req.body.user.email){
		return res.status(422).json({errors:{email:"can't be blank"}});
	}
	if(!req.body.user.password){
		return res.status(422).json({errors:{password:"can't be blank"}});
	}

	passport.authenticate('local',{session:false},function(err,user,info){
		if(err){return next(err)}

		if(user){
			user.token = user.generateJWT();
			return res.json({user: user.toAuthJSON()});
		}else{
			return res.status(422).json(info);
		}
	})(req,res,next);
})

// '/api/users'
router.post('/users',function(req,res,next){
	var user = new User();
	user.username = req.body.username;
	user.email = req.body.email;
	user.setPassword(req.body.password);
	console.log(user);
	user.save().then(function(){
		//return res.json({user: user.toAuthJSON()});
		return res.json({user})
	}).catch(next);
})

//

module.exports = router;