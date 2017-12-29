var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var jwt = require('jsonwebtoken');
var secret = require('../config/envs').secret;

var UserSchema = new mongoose.Schema({
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
	image:{
		type: String,
		default: "https://static.productionready.io/images/smiley-cyrus.jpg"
	},
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
},{timestamps: true});


UserSchema.plugin(uniqueValidator,{message:'is already taken.'});

UserSchema.methods.validPassword = function(password){
	bcrypt.compare(password,this.password,function(err,isMatch){
		if(err)return next(err);
		next(err,isMatch);
	})
}

UserSchema.methods.setPassword = function(password){
	bcrypt.genSalt(10,function(err,salt){
		this.salt = salt;
		bcrypt.hash(password, salt, function(err, hashedPassword) {
			this.password = hashedPassword
		})
	})
}

UserSchema.methods.generateJWT = function(){
	return jwt.sign({
		id:this._id,
		username:this.username,
		exp: Math.floor(Date.now() / 1000) + (60 * 60),
	}, secret);
}

UserSchema.methods.toAuthJSON = function(){
	return {
		username: this.username,
		email:this.email,
		token: this.generateJWT(),
		bio: this.bio,
		image: this.image
	}
}

UserSchema.methods.toProfileJSONFor = function(user){
	//check if A has followwer {user}
	return {
		username: this.username,
		bio: this.bio,
		image: this.image ,
		following: user ? user.isFollowing(this._id) : false
	}
}

UserSchema.methods.favorite = function(id){
	if(this.favorites.indexOf(id) == -1){
		this.favorites.push(id)
	}

	return this.save();
}

UserSchema.methods.unFavorite = function(id){
	this.favorites.remove(id);
	return this.save();
}

UserSchema.methods.isFavorite = function(id){
	return this.favorites.some(function(favoriteId){
		return favoriteId.toString() === id.toString();
	})
}

UserSchema.methods.follow = function(id){
	if(this.following.indexOf(id) == -1){
		this.following.push(id);
	}

	return this.save();
}

UserSchema.methods.unfollow = function(id){
	this.following.remove(id);

	return this.save();
}

UserSchema.methods.isFollowing = function(id){
	return this.following.some(function(followId){
		return followId.toString() === id.toString();
	})
}


module.exports = mongoose.model('User',UserSchema);
