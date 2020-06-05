const express = require('express');
const router = express.Router();
const Controller = require('../controllers/betaTests');
const EpilogueController = require('../controllers/epilogues');
const Auth = require('../middlewares/auth');

router.post('/', Auth.verifyToken, Controller.registerBetaTest);
router.get('/', Auth.verifyToken, Controller.getAllBetaTests);
router.get('/:id', Auth.verifyToken, Controller.getBetaTest);
router.put('/:id', Auth.verifyToken, Controller.updateBetaTest);

/* Epilogue */
router.get('/:betaTestId/epilogue', Auth.verifyToken, EpilogueController.getEpilogue);
router.post('/:betaTestId/epilogue', Auth.verifyToken, EpilogueController.upsertEpilogue);
router.delete('/:betaTestId/epilogue', Auth.verifyToken, EpilogueController.deleteEpilogue);

module.exports = router;
