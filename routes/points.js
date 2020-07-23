const express = require('express');
const router = express.Router();
const Controller = require('../controllers/points');
const Auth = require('../middlewares/auth');

router.get('/', Auth.verifyToken, Controller.getPoints);
router.put('/:id/exchange', Auth.verifyToken, Controller.updateOperationDataForExchange);

module.exports = router;
