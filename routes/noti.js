const express = require('express');
const router = express.Router();
const Controller = require('../controller/noti');

/* GET users listing. */
router.post('/', Controller.sendNoti);
router.post('/topics/:topic', Controller.sendNotiByTopic);

module.exports = router;
