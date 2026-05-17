var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const { DB } = require('./config/mongo.connection');
const fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth.routes');
var qrRouter = require('./routes/qr');
var managerRouter = require('./routes/manager.routes');
var restaurantRouter = require('./routes/restaurant.routes');
var productRoutes = require('./routes/produit.routes');
var categoryRoutes = require('./routes/category.routes');
var tableRoutes = require('./routes/table.routes');
var groupeRoutes = require('./routes/groupe.routes');
require('dotenv').config();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/qr', qrRouter);
app.use('/auth', authRouter);
app.use('/manager', managerRouter);
app.use('/api', restaurantRouter);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tableRoutes);
app.use('/api', groupeRoutes);
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
  res.json('error');
});


const server = http.createServer(app);
server.listen( process.env.Port, () => {
   DB();
  console.log(`Server is running on port ${ process.env.Port }`);
});