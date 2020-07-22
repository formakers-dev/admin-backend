const express = require('express');
const router = express.Router();
const Controller = require('../controllers/points');
const Auth = require('../middlewares/auth');

router.get('/', Auth.verifyToken, Controller.getPoints);

module.exports = router;