
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./libs/log')(module);

var app = express();

app.set('port',config.get('port'));

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'ejs');

//Обработака favicon.ico
app.use(express.favicon());

//Запись в логгер
if (app.get('env') == 'development'){
	app.use(express.logger('dev'));	
} else {
	app.use(express.logger('default'));
}

//Разбирает тело запроса 
app.use(express.bodyParser());

//парсит заголовки
app.use(express.cookieParser());

app.use(app.router);

app.get('/',function(req, res, next) {
	res.render("index", {
		title: 'foreigner'

	});
})

app.use(express.static(path.join(__dirname, 'public')));

//Обработчик ошибок, т.е. если вдруг в next() содержится аргумент, то данное событие обрабатываетс здесь 
app.use(function(err, req, res, next) {
	if (app.get('env') == "development") {
		var errorHandler = express.errorHandler();
		errorHandler(err, req, res, next);
	} else {
		res.send(500);
	}
})


/*

//Middleware
app.use(function(req, res, next) {
	if (req.url == '/') {
		res.end("Hello world");
	} else {
		next();
	}
})

app.use(function(req, res, next) {
	if (req.url == '/test') {
		res.end("Test");
	} else {
		next();
	}
})

//Создание обработчика при входе на зарпещенную страницу; соответственно генерирование ошибки и перенаправление на обработчик ошибок
app.use(function(req, res, next) {
	if (req.url == '/forbidden') {
		next(new Error("woops, something wrong"));
	} else {
		next();
	}
})

//Заверщающий обработчик ошибок, т.е. который не сылается больше не на какой next
app.use(function(req, res) {
	res.send(404, "Page not found");
})


*/


/*
var routes = require('./routes');
var user = require('./routes/user');

app.get('/', routes.index);
app.get('/users', user.list);
*/

http.createServer(app).listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});
