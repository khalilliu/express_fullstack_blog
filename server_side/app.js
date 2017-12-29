var express= require('express');
var mongoose = require('mongoose');
var config = require('./config/configServer'),
		{secret,isProd} = require('./config/envs');

//seting app server
var app = express();

app = config(app);





mongoose.Promise = global.Promise;

if(isProd){
	mongoose.connect(process.env.MONGODB_URI)
}else{
	mongoose.connect('mongodb://localhost/conduit',{
		keepAlive: true,
  	reconnectTries: Number.MAX_VALUE,
  	useMongoClient: true
	}).then(()=>{console.log('mongodb connected...')})
		.catch((err)=>{console.log(err)});
	mongoose.set('debug',true);
}

//require models
require('./models')();


require('./config/passport');


//set routes
app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//dev error handler
if (!isProd) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}else{
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

var server = app.listen(process.env.PORT || 3001,function(){
	console.log('Listening on port ' + server.address().port);
})

