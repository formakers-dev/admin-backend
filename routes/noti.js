const express = require('express');
const router = express.Router();
const Controller = require('../controllers/noti');
const Auth = require('../middlewares/auth');

/* GET users listing. */
router.post('/', Auth.verifyToken, Controller.sendNoti);
router.put('/', Auth.verifyToken, Controller.updateReservedNoti);

router.post('/topics/:topic', Auth.verifyToken, Controller.sendNotiByTopic);
router.put('/topics/:topic', Auth.verifyToken, Controller.updateReservedNotiByTopic);

router.post('/reserved/cancel', Auth.verifyToken, Controller.cancelReservedNoti);
router.get('/reserved', Auth.verifyToken, Controller.getReservedNotiList);

module.exports = router;
