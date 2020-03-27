const express = require('express');
const router = express.Router();
const Controller = require('../controllers/apps');

router.get('/:packageName', Controller.getApp);

module.exports = router;
