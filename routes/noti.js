const express = require('express');
const router = express.Router();
const Controller = require('../controllers/noti');

/* GET users listing. */
router.post('/', Controller.sendNoti);
router.put('/', Controller.updateReservedNoti);

router.post('/topics/:topic', Controller.sendNotiByTopic);
router.put('/topics/:topic', Controller.updateReservedNotiByTopic);

router.post('/reserved/cancel', Controller.cancelReservedNoti);
router.get('/reserved', Controller.getReservedNotiList);
module.exports = router;
