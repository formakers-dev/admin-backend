const express = require('express');
const router = express.Router();
const Controller = require('../controllers/participants');
const Auth = require('../middlewares/auth');

router.get('/', Auth.verifyToken, Controller.getParticipants);
router.post('/', Auth.verifyToken, Controller.registerParticipants);
router.delete('/:id', Auth.verifyToken, Controller.deleteParticipant);

router.delete('/beta-test/:betaTestId/user/:userId', Auth.verifyToken, Controller.deleteParticipantForBetaTest);

module.exports = router;
