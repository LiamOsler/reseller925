var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var pgp = require('pg-promise')();

var indexRouter = require('./routes/index');
var clientsRouter = require('./routes/clients');
var partsRouter = require('./routes/parts');
var posRouter = require('./routes/pos');
var linesRouter = require('./routes/lines');
const listEndpoints = require('express-list-endpoints')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/clients', clientsRouter);
app.use('/parts', partsRouter);
app.use('/pos', posRouter);
app.use('/lines', linesRouter);


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

console.log(listEndpoints(app));


module.exports = app;
