const express = require('express');
const router = express.Router();
const Controller = require('../controllers/requests');

router.get('/', Controller.getRequests);
router.get('/:id', Controller.getRequest);

module.exports = router;
