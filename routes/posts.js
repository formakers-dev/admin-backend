const express = require('express');
const router = express.Router();
const Controller = require('../controllers/posts');

/* GET users listing. */
router.get('/', Controller.getPosts);
router.post('/', Controller.registerPost);
router.put('/:id', Controller.updatePost);
router.post('/delete', Controller.deletePosts);
router.delete('/:id', Controller.deletePost);
module.exports = router;
