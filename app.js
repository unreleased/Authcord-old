const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const discordRouter = require('./routes/discord');
const adminRouter = require('./routes/admin');

const app = express();

// session
app.set('trust proxy', 1);
app.use(
  session({
    secret: 'keyboard rabbit authycord express magic cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 86400000,
    },
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/discord', discordRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// user middleware handler
app.use((req, res, next) => {
  next();
});

module.exports = app;
