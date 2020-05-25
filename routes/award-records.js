const express = require('express');
const router = express.Router();
const Controller = require('../controllers/award-records');
const Auth = require('../middlewares/auth');

router.get('/', Auth.verifyToken, Controller.getAwardRecords);
router.post('/', Auth.verifyToken, Controller.registerAwardRecords);
router.put('/:id', Auth.verifyToken, Controller.updateAwardRecords);
router.post('/delete', Auth.verifyToken, Controller.deleteAwardRecords);

module.exports = router;
