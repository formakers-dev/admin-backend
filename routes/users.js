const express = require('express');
const router = express.Router();
const Controller = require('../controllers/users');

router.get('', Controller.getUsers);
router.post('/search', Controller.getUsersByFilter);
module.exports = router;
