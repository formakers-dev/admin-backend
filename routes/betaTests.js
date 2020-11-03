const express = require('express');
const router = express.Router();
const Controller = require('../controllers/betaTests');
const EpilogueController = require('../controllers/epilogues');
const Auth = require('../middlewares/auth');

router.post('/', Auth.verifyToken, Controller.registerBetaTest);
router.get('/', Auth.verifyToken, Controller.getAllBetaTests);
router.put('/:id', Auth.verifyToken, Controller.updateBetaTest);

/** 운영페이지 내부 요청 및 외부요청(from=external_script) 둘 다 사용 **/
router.get('/:id', Auth.verify, Controller.getBetaTest);

// path 고민
router.get("/:betaTestId/mission/:missionId/feedback", Auth.verifyToken, Controller.getFeedback);

/* Epilogue */
router.get('/:betaTestId/epilogue', Auth.verifyToken, EpilogueController.getEpilogue);
router.post('/:betaTestId/epilogue', Auth.verifyToken, EpilogueController.upsertEpilogue);

router.delete('/:betaTestId/epilogue', Auth.verifyToken, EpilogueController.deleteEpilogue);

module.exports = router;
