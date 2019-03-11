var express = require('express');
var router = express.Router();
var Controller = require('../controller/noti');

/* GET users listing. */
router.post('/', Controller.sendNoti);

module.exports = router;
