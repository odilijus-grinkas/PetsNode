var createError = require('http-errors');
var express = require('express');
var path = require('path'); // less error-prone paths with path.join
var cookieParser = require('cookie-parser'); // ?????
var logger = require('morgan'); // for detailed logs
const sql = require('mysql2/promise'); // sql promise version
const session = require('express-session'); // will be used in PetControl.index

// Import routes
const PetRoutes = require('./routes/PetRoutes');
const StatRoutes = require('./routes/StatRoutes');

// App start
const app = express();

// database connection setup
const con = sql.createPool({
  host: "localhost",
  user: "root",
  database: "PetsNode"
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Load middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Insert database connection into app
app.use((req, res, next)=>{
  req.con = con;
  next();
  });

// Setup session
app.use(session({
  secret: Math.random()+"",
  cookie: {maxAge: 24*60*60*1000},
  saveUninitialized: true,
  resave: false
}))

// Load routes
app.use(PetRoutes);
app.use(StatRoutes);

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
