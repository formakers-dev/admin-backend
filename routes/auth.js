const express = require('express');
const router = express.Router();
const Controller = require('../controllers/auth');
const Auth = require('../middlewares/auth');

router.post('/login', Controller.login);
router.post('/sign-up', Controller.signUp);
router.post('/logout', Controller.logout);
router.get('/check', Auth.verifyToken, Controller.check);

module.exports = router;
