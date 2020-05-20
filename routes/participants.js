const express = require('express');
const router = express.Router();
const Controller = require('../controllers/participants');
const Auth = require('../middlewares/auth');

router.get('/', Auth.verifyToken, Controller.getParticipants);
router.post('/', Auth.verifyToken, Controller.registerParticipants);
router.delete('/:id', Auth.verifyToken, Controller.deleteParticipant);
module.exports = router;
