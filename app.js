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
const history = require('connect-history-api-fallback');

const app = express();
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


// jwt middleware
const JWT = require('./util/jwt');
const jwtMiddleware = function (req, res, next) {
    const cookies = {};
    const rawCookies = req.headers.cookie;
    rawCookies && rawCookies.split(';').forEach(function( cookie ) {
        const parts = cookie.split('=');
        cookies[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    if(cookies['access_token'] || req.headers.authorization){
        try{
            const token = req.headers.authorization ? req.headers.authorization : cookies['access_token'];
            const decodedToken = JWT.verify(token);
            //만료시간 한시간 전에 API 요청이 왔다면, token 을 자동 갱신해준다.
            if(decodedToken.exp - Date.now()/1000 < 3600){
                const newToken = JWT.generateToken(req, res,{id: decodedToken.id});
                res.setHeader('Authorization', newToken);
            }else{
                res.setHeader('Authorization', token);
            }
            next();
        }catch(err){
            console.error(err);
            res.clearCookie("access_token");
            next(err);
        }
    }else{
        if(req.path !== '/api/auth/login' && req.path !== '/api/auth/logout' && req.path !== '/api/auth/sign-up'){
            res.status(403).json({error:"토큰 정보가 없습니다."});
        }else{
            next();
        }
    }

};
app.use(jwtMiddleware);

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
