const express = require('express');
const router = express.Router();
const Controller = require('../controllers/posts');

/* GET users listing. */
router.get('/', Controller.getPosts);
router.post('/', Controller.registerPost);

module.exports = router;
