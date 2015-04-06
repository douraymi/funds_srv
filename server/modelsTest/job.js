// var app = require('loopback');

module.exports = function(Job) {
	Job.dada = function(ctx, cb){
		console.log(ctx);
		cb(null, ctx);
	};
	Job.remoteMethod(
		'dada',
		{
			http: {path: '/dada', verb: 'get'},
			accepts: [
   			{arg: 'obj', type: 'object', http: function(ctx) {
			    // ctx is LoopBack Context object
			 
			    // 1. Get the HTTP request object as provided by Express
			    var req = ctx.req;
			 
			    // return req.signedCookies;
			    return req.accessToken;
			  } }
   		],
			returns: {arg: 'ok', type: 'object'}
		}
	);


};



