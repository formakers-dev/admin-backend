const express = require('express');
const router = express.Router();
const Controller = require('../controllers/betaTests');

/* GET users listing. */
router.post('/', Controller.registerBetaTest);

module.exports = router;
