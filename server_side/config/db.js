var { secret,isProd } = require('./index.js');

module.exports = function(mongoose){
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
}
