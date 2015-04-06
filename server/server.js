var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');

var app = module.exports = loopback();

//自己写的小插件 app.wmi(req, fn(err, me)) 在回调函数里使用“我”
app.wmi = require('./etc/wmi')(app);

// Set up the /favicon.ico
app.use(loopback.favicon());

// request pre-processing middleware
app.use(loopback.compress());

// -- Add your pre-processing middleware here --

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser');
app.use(cookieParser('SECRET'));

app.use(loopback.token({ model: app.models.accessToken }));
// app.use(function(req, res, next){
// 	if(!req.accessToken && req.signedCookies.authorization){
// 		res.clearCookie("authorization");
// 	};
// 	next();
// });

// boot scripts mount components like REST API
boot(app, __dirname);

// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
// Example:
app.use("/", loopback.static(path.resolve(__dirname, '../client')));
app.use("/doc/", loopback.static(path.resolve(__dirname, '../docular_generated')));
// no using "explorer" "zapiz"

// configure view handler
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile);

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
// app.use(loopback.urlNotFound());

// The ultimate error handler.
// app.use(loopback.errorHandler());  //"errorhandler": "^1.1.1",

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
