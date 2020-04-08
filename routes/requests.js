const express = require('express');
const router = express.Router();
const Controller = require('../controllers/requests');
const Auth = require('../middlewares/auth');

router.get('/', Auth.verifyToken, Controller.getRequests);
router.post('/', Auth.verify, Controller.registerRequest);
router.get('/:id', Auth.verifyToken, Controller.getRequest);

module.exports = router;
