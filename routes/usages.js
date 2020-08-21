const express = require('express');
const router = express.Router();
const Controller = require('../controllers/usages');
const Auth = require('../middlewares/auth');

router.get('/game', Auth.verifyToken, Controller.getGameAppUsages);

module.exports = router;
