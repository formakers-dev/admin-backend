const express = require('express');
const router = express.Router();
const Controller = require('../controllers/users');
const Auth = require('../middlewares/auth');

router.get('', Auth.verifyToken, Controller.getUsers);
router.post('/search', Auth.verifyToken, Controller.getUsersByFilter);
module.exports = router;
