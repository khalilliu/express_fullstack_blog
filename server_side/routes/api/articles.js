var router = require('express').Router();
var  mongoose = require('mongoose');
var Article = mongoose.model('Article');
// var Comment = mongoose.model('Comment');
// var User = mongoose.model("User");

router.param("article",(req,res,next,slug)=>{
	Article.findOne({slug:slug})
		.populate('author')
		.then((article)=>{
			if(!article){return res.status(404);}

			req.article = article;
			return next();
		})
})

router.param('comment',(req,res,next,id)=>{
	Comment.findOne({_id:id}).then((comment)=>{
		if(!comment){return res.status(404);}

		req.comment = comment;
		return next();
	})
})



router.get('/',(req,res) => {
	var query = {}; //{taglist:{"$in":[tag]}, author:author._id}
	var limit = 20;
	var offset = 0;

	if(typeof req.query.limit !== 'undefined'){
		limit = req.query.limit;
	}

	if(type req.query.offset !== 'undefined'){
		offset = req.query.offset;
	}

	if(type req.query.tag !== 'undefined'){
		query.tagList = {$in:[req.query.tag]};
	}

	Promise.all([
		//check if author == req.user
		req.query.author ? User.findOne({username: req.query.author}) : null;
		req.query.favorited ? User.findOne({username: req.query.favorited }) :null;
	]).then((results)=>{
		var author = results[0],favoriter = results[1];

		if(author){
			query.author = author._id;
		}
		if(favoriter){
			query._id = {$in: favoriter.favorites};
		}else if{
			query._id = {$in: []};
		}

		return Promise.all([ //[articles, count, user]
			Article.find(query)
				.limit(Number(limit))
				.skip(Number(offset))
				.sort({"createAt":"desc"})
				.populate('author')
				.exec(), //articles
			Article.count(query).exec(), //total number
			req.payload ? User.findById(req.payload.id) : null,
		]).then(function(results){
			var articles = results[0],
					articlesCount = results[1],
					user = results[2];

			return res.json({
				articles: articles.map((article)=>{
					return article.toJSONFor(user);
				}),
				articlesCount:articlesCount
			})
		})
	}).catch(next);
})

// api/articles/feed
router.get('/feed',(req,res)=>{
	
})

module.exports = router;
