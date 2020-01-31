var express = require('express'),
	app = express(),
	post = require('./routes/post');
var bodyParser = require('body-parser');
var connect = require('connect');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var csrf = require('csurf');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride(function(req, res){
	if(req.body && typeof req.body == 'object' && '_method' in req.body){
		var method = req.body._method
		delete req.body._method
		return method
	}
}));

// csrf対策
app.use(cookieParser());
app.use(expressSession({secret: '1234asdf'}));
app.use(csrf());
app.use(function(req, res, next){
	res.locals.csrftoken = req.csrfToken();
	next();
})

// ディレクトリ
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// middleware
var logger = require('morgan');
app.use(logger('dev'));


// routing
app.get('/', post.index);
app.get('/posts/new', post.new);
app.post('/posts/create', post.create);
app.get('/posts/:id([0-9]+)', post.show);
app.get('/posts/:id/edit', post.edit);
app.put('/posts/:id', post.update);
app.delete('/posts/:id', post.destroy);


// app.get('/new', function(req, res){
// 	res.render('new');
// });

app.listen(3000);
console.log("server starting ... ")