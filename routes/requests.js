const express = require('express');
const router = express.Router();
const Controller = require('../controllers/requests');

router.get('/', Controller.getRequests);

module.exports = router;
