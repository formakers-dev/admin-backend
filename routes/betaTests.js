const express = require('express');
const router = express.Router();
const Controller = require('../controllers/betaTests');
const Auth = require('../middlewares/auth');

router.post('/', Auth.verifyToken, Controller.registerBetaTest);
router.get('/', Auth.verifyToken, Controller.getAllBetaTests);
router.get('/:id', Auth.verifyToken, Controller.getBetaTest);
router.put('/:id', Auth.verifyToken, Controller.updateBetaTest);

module.exports = router;
