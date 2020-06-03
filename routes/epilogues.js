const express = require('express');
const router = express.Router();
const Controller = require('../controllers/epilogues');
const Auth = require('../middlewares/auth');

/* GET users listing. */
router.get('/', Auth.verifyToken, Controller.getEpilogue);
router.post('/', Auth.verifyToken, Controller.upsertEpilogue);
router.delete('/:id', Auth.verifyToken, Controller.deleteEpilogue);

module.exports = router;
