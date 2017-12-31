var passport = require('passport');
var LocalStrategy = require('passport-local');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var colors = require('colors');

passport.use(new LocalStrategy({
	usernameField: 'user[email]',
	passwordField: 'user[password]'
},function(email,password,done){
	User.findOne({email:email}).then(function(user){
		// if(!user||!user.validPassword(password)){
		// 	return done(null,false,{errors:{ 'email or password' : 'is invalid' }})
		// }
		console.log(user);
		if(!user){
			return done(null,false,{errors:{ 'email or password' : 'is invalid' }})
		}else{

			user.validPassword(password,function(err,isMatch){
				console.log(isMatch)
			if(isMatch){return done(null,user)}
			else{return done(null,false,{errors:{ 'email or password' : 'is invalid' }})}
			})
		}
		

	}).catch(done);
}))