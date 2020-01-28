var express = require('express');

const packagejson = require('../package.json');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fomes Admin Server - ' + process.env.NODE_ENV + ' (' + packagejson.version + ')' });
});

module.exports = router;
