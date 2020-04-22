const express = require('express');
const router = express.Router();
const Controller = require('../controllers/apps');
const Auth = require('../middlewares/auth');

router.get('/:packageName', Auth.verifyToken, Controller.getApp);

module.exports = router;
