const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const config = require('./config');
const indexRouter = require('./routes/indexRouter');
const notiRouter = require('./routes/noti');
const postsRouter = require('./routes/posts');
const betaTestsRouter = require('./routes/betaTests');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const appsRouter = require('./routes/apps');
const requestsRouter = require('./routes/requests');
const adminRouter = require('./routes/admin'); //admin 관련 정보를 위한 라우터 ex) admin 사용자 정보 등
const participantsRouter = require('./routes/participants');
const history = require('connect-history-api-fallback');
const awardRecordsRouter = require('./routes/award-records');
const statisticsRouter = require('./routes/statistics');
const pointsRouter = require('./routes/points');
const usagesRouter = require('./routes/usages');

const app = express();
// app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.header.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Expose-Headers', 'Authorization');
    next();
});

const corsOptions = {
    origin: config.frontendBaseUrl,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

if (config.web.cors) {
    app.options('*', cors(corsOptions));
    app.use(cors(corsOptions));
}

// prevent 304
app.set("etag", false);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/api/noti', notiRouter);
app.use('/api/posts', postsRouter);
app.use('/api/beta-test', betaTestsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/apps', appsRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/participants', participantsRouter);
app.use('/api/award-records', awardRecordsRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/points', pointsRouter);
app.use('/api/usages', usagesRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log("error");
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
