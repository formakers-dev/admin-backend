const express = require('express');
const router = express.Router();
const Controller = require('../controllers/auth');

router.post('/login', Controller.login);
router.post('/sign-up', Controller.signUp);
router.post('/logout', Controller.logout);
router.get('/check', Controller.check);

module.exports = router;
