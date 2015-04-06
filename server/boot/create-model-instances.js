// var debug = require('debug')('boot:create-model-instances');

// module.exports = function(app) {
//   // console.log("IN: create-model-instances");
//   var User = app.models.userTest;
//   var Role = app.models.Role;
//   var RoleMapping = app.models.RoleMapping;

//   User.create([
//     {username: 'd', email: 'd@d.com', password: 'd'},
//     {username: 'e', email: 'e@e.com', password: 'e'}
//   ], function(err, users) {
//     if (err) throw err;
//     debug(users);
//     //create project 1 and make john the owner
//     var nowdate = new Date();
//     users[0].jobs.create({
//       "date": nowdate
//     }, function(err, project) {
//       if (err) throw err;
//       debug(project);
//     });

//     //create project 2 and make jane the owner
//     users[1].jobs.create({
//       "date": "2014-10-10"
//     }, function(err, project) {
//       if (err) throw err;
//       debug(project);
//     });

//   });
// };
