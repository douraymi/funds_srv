module.exports = function(UserTest) {
	UserTest.caca = function(cb){
		var nowdate = new Date();
		this.jobs.create({
      "date": nowdate
    }, cb);
	// UserTest.jobs.find({
 //      fields: {
 //        balance: false
 //      }
 //    }, cb);

	};
	UserTest.remoteMethod(
		'caca',
		{
			http: {path: '/caca', verb: 'get'},
			returns: {arg: 'ok', type: 'object'}
		}
	);


};



