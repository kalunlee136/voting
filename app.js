var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

var port = process.env.port || 8080
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//connect to mongoDB server
var mongoose = require('mongoose');
require('./models/Polls');

//mongoose.connect('mongodb://localhost/news');
mongoose.connect('mongodb://kalunlee136:564213ab@ds011278.mongolab.com:11278/voter');


// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

routes(app);

app.listen(port);
console.log("App listening on port "+port);