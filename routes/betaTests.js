const express = require('express');
const router = express.Router();
const Controller = require('../controllers/betaTests');
const Auth = require('../middlewares/auth');

router.post('/', Auth.verifyToken, Controller.registerBetaTest);
router.get('/all', Auth.verifyToken, Controller.getAllBetaTests);

module.exports = router;
