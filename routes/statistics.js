const express = require('express');
const router = express.Router();
const Controller = require('../controllers/statistics');
const Auth = require('../middlewares/auth');

router.get('/participants', Auth.verifyToken, Controller.getParticipants);
router.get('/award-records', Auth.verifyToken, Controller.getAwardRecords);
router.get('/users', Auth.verifyToken, Controller.getUsers);
router.get('/beta-tests', Auth.verifyToken, Controller.getBetaTests);
module.exports = router;
