var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var jwt = require('jsonwebstoken');
var secret = require('../config/index').secret;

var UserShema = new mongoose.Schema({
	username:{
		type:String, 
		lowercase: true,
		require:[true,'can not be blanked'],
		match:[/^[a-zA-Z0-9]+$/, 'is invalid'],
		index:true
	},
	email:{
		type: String,
		require: [true,'can not be blanked'],
		match: [/\S+@\S+\.\S+/, 'is invalid'],
		index:true
	},
	bio:String,
	image:String,
	favorites: [{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Article'
	}],
	following:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	}],
	password:{type:String,require:true},
	salt: String
},{timeStamps: true});

UserShema.plugin(uniqueValidator,{message:'is already taken.'});

UserShema.methods.validPassword = function(password){
	bcrypt.compare(password,this.password,function(err,isMatch){
		if(err)return next(err);
		next(err,isMatch);
	})
}

UserShema.methods.setPassword = function(password){
	bcrypt.genSalt(10,function(err,salt){
		this.salt = salt;
		bcrypt.hash(password, salt, function(err, hashedPassword) {
			this.password = hashedPassword
		})
	})
}

UserShema.methods.generateJWT = function(){

	return jwt.sign({
		id:this._id;
		username:this.username,
		exp: Math.floor(Date.now() / 1000) + (60 * 60),
	}, secret);
}
