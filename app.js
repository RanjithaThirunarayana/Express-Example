var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const MongoClient = require("mongodb").MongoClient;

var indexRouter = require('./routes/index');
var recipesRouter = require('./routes/recipes');

var app = express();

let dbHost = "cs3.calstatela.edu";
let dbPort = 4042;
let dbUsername = "cs5220stu32";
let dbPassword = "fg5I3JplM1Yl";
let dbUrl = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbUsername}`;

MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, client) => {
  if(err){
    console.error("Failed to connect to database",err);
    process.exit(1);
  }else{
    console.log("Connected to database");
    app.locals.mongo = client;
    app.locals.db = client.db(dbUsername);
  }
  let db = client.db("cs5220stu32");

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/recipes', recipesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
