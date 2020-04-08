const JWT = require('../util/jwt');

const verifyToken = (req, res, next) => {
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
            if(err.name !== 'TokenExpiredError'){
                console.error(err.message);
            }
            res.clearCookie("access_token");
            res.removeHeader('Authorization');
            res.status(403).json({error:"유효하지 않는 토큰 정보입니다."});
        }
    } else{
        res.status(403).json({error:"토큰 정보가 없습니다."});
    }
};

const verifyAPIKey = (req, res, next) => {
    // TODO : 인증을 DB 연동할지는 방법 설계 후 진행한다.

    // 일단은 고정된 문자열로 인증
    const accessToken = req.headers['x-access-token'];
    if (accessToken && accessToken === "VGhpc0lzQXBwQmVl") {
        next();
    } else {
        res.status(403).json({error:"유효하지 않는 토큰 정보입니다."});
    }
};

const verify = (req, res, next) => {
    if (req.query.from === "external_script") {
        verifyAPIKey(req, res, next);
    } else {
        verifyToken(req, res, next);
    }
};

module.exports = {verifyToken, verify};
