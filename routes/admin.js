const express = require('express');
const router = express.Router();
const Controller = require('../controllers/admin');
const Auth = require('../middlewares/auth');

router.get('/assignees', Auth.verifyToken, Controller.getAssignees);
router.get('/user/profile', Auth.verifyToken, Controller.getProfile);
router.put('/user/profile', Auth.verifyToken, Controller.updateProfile);
module.exports = router;
