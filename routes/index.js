var express = require('express');

const packagejson = require('../package.json');

var router = express.Router();

/* GET home page. */
// /api/* 를 제외한 url 요청에대해 index.html 을 render 한다.
router.get(/\/((?!api).)*/, function(req, res, next) {
  console.log("/////");
  res.render('index', { title: 'Fomes Admin Server - ' + process.env.NODE_ENV + ' (' + packagejson.version + ')' });
});


module.exports = router;
