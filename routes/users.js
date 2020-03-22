const express = require('express');
const router = express.Router();
const Controller = require('../controllers/users');

router.get('', Controller.getUser);
router.post('/search', Controller.getUsers);
module.exports = router;
