var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body:String,
	author:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	article:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Article'
	}
},{timesStamps:true})

//require populate of author
CommentSchema.methods.toJSONFor = function (user){
	return {
		id: this._id,
		body: this.body,
		createdAt: this.createdAt,
		author: this.author.toProfileJSONFor(user)
	}
}


module.exports = mongoose.model('Comment',CommentSchema);
