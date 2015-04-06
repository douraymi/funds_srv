'use strict'

function wmi (app){
var ES = ' <wmi< ';

  return function(req, cb){
    var ER={};
    var actkModel = app.models.AccessToken;
    actkModel.findForRequest(req, {}, function(err, token){
      if(err){
        err.message+=" (1)"+ES;
        return cb(err);
      }
      if (!token){
        ER.status=401; ER.message=" (cant get the token)"+ES; return cb(ER);
      }

      var uModel = app.models.User;
      uModel.findById(token.userId, function(err, me){
        if(err){
          err.message+=" (2)"+ES;
          return cb(err);
        }
        if(!me){
          ER.status=401;
          ER.message=" (cant get the user)"+ES;
          return cb(ER);
        }

        cb(null, me);
      });
    });
  }
}

module.exports = wmi;

