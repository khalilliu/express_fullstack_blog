var router = require('express').Router();
var  mongoose = require('mongoose');
var {User,Article,Comment} = require('../../models')();
var auth = require('../auth');

// match /article/:slug
router.param("article", (req,res,next,slug)=>{
	Article.findOne({slug:slug})
		.populate('author')
		.then((article)=>{
			if(!article){return res.status(404);}

			req.article = article;
			return next();
		})
})

// match /comment/:id
router.param('comment',(req,res,next,id)=>{
	Comment.findOne({_id:id}).then((comment)=>{
		if(!comment){return res.status(404);}

		req.comment = comment;
		return next();
	})
})


router.get('/',auth.optional,(req,res,next)=>{
	var query = {};
	var limit = 20;
	var offset = 0;
	if(typeof req.query.limit !== 'undefined'){
		limit = req.query.limit;
	}
	if(typeof req.query.offset !== 'undefined'){
		offset = req.query.offset;
	}
	if(typeof req.query.tag !== 'undefined'){
		query.tagList = {$in: [req.query.tag]};
	}

	//用户的文章 或是 用户喜欢的文章//
	Promise.all([
		req.query.author ? User.findOne({username:req.query.author}):null,
		req.query.favorited ? User.findOne({username:req.query.favorited}) : null
	]).then(function(results){
		var author = results[0],
				favoriter = results[1];

		if(author){
			query.author = author._id;
		}
		if(favoriter){
			query._id = {$in: favoriter.favorites}
		}else if(req.query.favorited){
			query._id = {$in:[]} //return null
		}

		return Promise.all([
			Article.find(query)
				.limit(Number(limit))
				.skip(Number(offset))
				.sort({createdAt:'desc'})
				.populate('author')
				.exec(),
			Article.count(query).exec(),
			req.payload ? User.findById(req.payload.id) : null
		]).then(function(results){
			var articles = results[0],
					articlesCount = results[1],
					user = results[2];

			return res.json({
				articles: articles.map(function(article){return article.toJSONFor(user)})
			})
		})	
	})
})

// api/articles/feed
router.get('/feed',auth.required,function(req,res,next){
	var limit = 20;
	var offset=0;

	if(typeof req.query.limit !== 'undefined'){limit = req.query.limit}
	if(typeof req.query.offset !== 'undefined'){offset = req.query.offset}

		User.findById(req.payload.id).then(function(user){
			if(!user){return res.sendStatus(401)}

				Promise.all([
					Article.find({author: {$in:[user.following]}})
						.limit(Number(limit))
						.skip(Number(offset))
						.populate('author')
						.exec(),
					Article.count({author:{$in:[user.following]}})
				]).then(function(results){
					var articles = results[0],
							articlesCount = results[1];

					return res.json({
						articles: articles.map(function(article){
							return article.toJSONFor(user);
						}),
						articlesCount: articlesCount
					})
				}).catch(next);
		})
})

//post a article req.payload
router.post('/',auth.required,function(req,res,next){
	User.findById(req.payload.id).then(function(user){
		if(!user){return res.sendStatus(401)}
		var article = new Article(req.body.article);
		article.author = user;

		return article.save().then(function(newArticle){
			console.log(newArticle.author);
			return res.json({article: article.toJSONFor(user)});
		})
	}).catch(next);
})

//return a article 
//this is use the req.param("article",function(req,res,next,slug))
router.get('/:article',auth.optional,function(req,res,next){
	Promise.all([
		req.payload ? User.findById(req.payload.id) : null,
		req.article.populate('author').execPopulate()
	]).then(function(results){
		var user = results[0];
		return res.json({article: req.article.toJSONFor(user)})
	}).catch(next);
})

//update article
router.put("/:article",auth.required,function(req,res,next){
	User.findById(req.payload.id).then(function(user){
		if(req.article.author._id.toString() === req.payload.id.toString()){
			if(typeof req.body.article.title!=='undefined'){
				req.article.title = req.body.article.title;
			}
			if(typeof req.body.article.description!=='undefined'){
				req.article.description = req.body.article.description;
			}
			if(typeof req.body.article.body!=='undefined'){
				req.article.body = req.body.article.body;
			}
			if(typeof req.body.article.tagList!=='undefined'){
				req.article.tagList = req.body.article.tagList;
			}

			req.article.save().then(function(article){
				//user is the author of the article
				return res.json({article: article.toJSONFor(user)})
			}).catch(next);
		}else{
			return res.status(403);
		}
	})
})

//delete article
router.delete('/:article',auth.required,function(req,res,next){
	User.findById(req.payload.id).then(function(user){
		if(!user){return res.sendStatus(401)}
		//  check if currentUser is the author of article
		if(req.article.author._id.toString()===req.payload.id.toString()){
			return req.article.remove().thne(function(){
				res.sendStatus(204)
			})
		}else{
			return res.sendStatus(403)
		}
	})
})

//favorite an article
router.post('/:article/favorite',auth.required,function(req,res,next){
	var articleId = req.article._id;
	//currentUser
	User.findById(req.payload.id).then(function(user){
		if(!user){return res.sendStatus(401)}

		return user.favorite(articleId).then(function(){
			return req.article.updateFavoriteCount().then(function(article){
				return res.json({article: article.toJSONFor(user)})
			})
		})
	}).catch(next);
})

//unfavorite an article
router.post('/:article/favorite',auth.required,function(req,res,next){
	var articleId = req.article._id;

	//get current user
	User.findById(req.payload.id).then(function(user){
		if(!user){return res.sendStatus(401)}
		return user.unfavorite(articleId).then(function(){
			return req.article.updateFavoriteCount().then(function(article){
				return res.json({article: article.toJSONFor(user)})
			})
		})
	}).catch(next);
})

//return a artilce's comment
router.get('/:article/comment', auth.optional, function(req,res,next){
	Promise.resolve(req.payload ? User.findById(req.payload.id) : null)
		.then(function(user){
			return req.article.populate({
				path:'comments',
				populate:{
					path: 'author'
				},
				options:{
					sort:{
						createdAt: 'desc'
					}
				}
			}).exec(function(article){
				return res.json({
					comments: req.article.comments.map(function(comment){
						return comment.toJSONFor(user);
					})
				})
			})
		}).catch(next);
})

//create a new comment
router.post('/:article/comments', auth.optional,function(req,res,next){
	User.findById(req.payload.id).then(function(user){
		if(!user){return res.sendStatus(401)}

		var comment = new Comment(req.body.comment);
		comment.article = req.article;
		comment.author = user;

		return comment.save().then(function(){
			res.article.comments.push(comment);

			return req.article.save().then(function(article){
				res.json({comment: comment.toJSONFor(user)})
			})
		})
	}).catch(next);
})

//delete a comment
router.delete('/:article/comments/:comment',auth.required,function(req,res,next){
	if(req.comment.author.toString() === req.payload.id.toString()){
		req.article.comments.remove(req.comment._id);
		req.article.save()
			.then(Comment.findById(req.comment._id).remove().exec())
			.then(function(){res.sendStatus(204)})
	}else{
		res.sendStatus(403);
	}
})


module.exports = router;
