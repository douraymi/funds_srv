// var app = require('../../server/server');
var path = require('path');

module.exports = function(User) {
  //hooks

  // User.afterRemote('prototype.__get__stocks', function(ctx, val, next){
  //   console.log("in User");
  //   // ctx.result.abc = "abc";
  //   // ctx.result.d = {};
  //   // ctx.result.d.iRecordsTotal = 123;

  //   // var data = ctx.result;
  //   // ctx.result = [];
  //   // ctx.result[0] = data;
  //   // ctx.result[1] = {};
  //   // ctx.result[1].iRecordsTotal = 123;

  //   // ctx.result.prototype.d = {};
  //   // ctx.result.prototype.d.iRecordsTotal = 123;

  //   var data = ctx.result;
  //   ctx.result = {};
  //   ctx.result.data = data;

  //   ctx.result["recordsTotal"] = 1234;
  //   console.log('ctx.result:', ctx.result);
  //   // console.log('ctx:', ctx);
  //   // console.log('val:', val);

  //   next();
  // });

  //send verification email after registration
  User.afterRemote('create', function(ctx, user, next) {
    // console.log('> user.afterRemote triggered');

    var options = {
      type: 'email',
      to: user.email,
      from: 'lzd@sz-kingray.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/',
      user: user
    };

    user.verify(options, function(err, response) {
      if (err) {
        next(err);
        return;
      }

      next();
      // ctx.res.redirect('/#/signNeedVerify');
      // ctx.res.redirect('/');
      // ctx.res.end("eenndd");

      // ctx.log('> verification email sent:', response);

      // ctx.res.render('response', {
      //   title: 'Signed up successfully',
      //   content: 'Please check your email and click on the verification link '
      //     + 'before logging in.',
      //   redirectTo: '/',
      //   redirectToLinkText: 'Log in'
      // });
    });
  });

  User.beforeRemote('login', function(ctx, user, next){
    // console.log(ctx.req.accessToken);
    if(ctx.req.accessToken){
      User.logout(ctx.req.accessToken.id, function(err){
        if(err) next(err);

        next();
      });
      return;
    }

    next();
  });

  // User.afterRemote('login', function(ctx, user, next){
  //   var req, res;
  //   req = ctx.req, res = ctx.res;
  //   if (user != null) {
  //     if (user.id != null) {
  //       res.cookie("authorization", user.id, {
  //         httpOnly: true,
  //         signed: true
  //       });
  //     }
  //   }
  //   next();
  // });

  // User.afterRemote("logout", function(ctx, result, next) {
    // var req,res;
    // req = ctx.req;
    // res = ctx.res;

    // var actkModel = User.app.models.AccessToken;
    // actkModel.findForRequest(req, {}, function(err, token){
    //   if(err || !token) next("cant get the token");

    //   token.accessToken.destroy();
    //   res.clearCookie("authorization");
    //   next();
    // });
  // });

  // remoteMethod



};


