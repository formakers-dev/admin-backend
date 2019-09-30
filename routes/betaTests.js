const express = require('express');
const router = express.Router();
const Controller = require('../controllers/betaTests');

router.post('/', Controller.registerBetaTest);
router.get('/all', Controller.getAllBetaTests);

module.exports = router;
