// var app = require('../../server/server');
// var path = require('path');

module.exports = function(Stock) {
  //hooks

  // Stock.afterRemote('**', function(ctx, val, next){
  //   console.log("in Stock");
  //   // ctx.result.abc = "abc";
  //   ctx.result.push({'test':'test'});
  //   console.log('ctx.result:', ctx.result);
  //   // console.log('val:', val);
  //   next();
  // });

  //send verification email after registration
  // User.afterRemote('create', function(ctx, user, next) {
  //   // console.log('> user.afterRemote triggered');

  //   var options = {
  //     type: 'email',
  //     to: user.email,
  //     from: 'lzd@sz-kingray.com',
  //     subject: 'Thanks for registering.',
  //     template: path.resolve(__dirname, '../../server/views/verify.ejs'),
  //     redirect: '/',
  //     user: user
  //   };

  //   user.verify(options, function(err, response) {
  //     if (err) {
  //       next(err);
  //       return;
  //     }

  //     next();

  //   });
  // });

  // User.beforeRemote('login', function(ctx, user, next){
  //   // console.log(ctx.req.accessToken);
  //   if(ctx.req.accessToken){
  //     User.logout(ctx.req.accessToken.id, function(err){
  //       if(err) next(err);

  //       next();
  //     });
  //     return;
  //   }

  //   next();
  // });


  // remoteMethod
  Stock.getList = function (filter, cb) {
     console.log(filter);
    // Stock.count()
    Stock.find(filter, function(err, v){
      if(err){
        console.log("err1:",err);
      }
      // var d = {};
      // var recordsFiltered = v.length;
      Stock.count(filter.where, function(err, recordsFiltered){
        if(err){
          console.log("err2:",err);
        }
        
        Stock.count({where:{'ownerId': filter.where.userId}}, function(err, recordsTotal){
          if(err){
            console.log("err3:",err);
          }
          // {'ownerId':'54ba301cc1b66fd373f4b10a'}
          // console.log(recordsTotal);
          cb(null, v, recordsFiltered, recordsTotal);
        });
      });
    });
  }
  Stock.remoteMethod('getList', {
        accepts:[{arg: 'filter', type:'object', http: {source: 'body'}}],
        returns:[
          {arg: 'data', type:'array'},
          {arg: 'recordsFiltered', type:'number'},
          {arg: 'recordsTotal', type:'number'}
        ],
        http:{path: '/getList', verb: 'post'}
  });

};


