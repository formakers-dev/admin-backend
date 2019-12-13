const express = require('express');
const router = express.Router();
const Controller = require('../controllers/users');

router.get('/:email/nick-name', Controller.getNickName);

module.exports = router;
