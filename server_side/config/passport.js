var passport = require('possport');
var LocalStrategy = require('passport-local');
var mongoose = require('mongoose');
var User = mongoose.model('User');


passport.use(new LocalStrategy({
	usernameField: 'user[email]',
	passwordField: 'user[password]'
},function(email,password,done){
	User.findOne({email:email}).then(function(user){
		// if(!user||!user.validPassword(password)){
		// 	return done(null,false,{errors:{ 'email or password' : 'is invalid' }})
		// }
		user.validPassword(password,function(err,isMatch){
			if(isMatch){return done(null,user)}
			else{return done(null,false,{errors:{ 'email or password' : 'is invalid' }})}
		})

	}).catch(done);
}))