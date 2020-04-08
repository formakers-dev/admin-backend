const express = require('express');
const router = express.Router();
const Controller = require('../controllers/posts');
const Auth = require('../middlewares/auth');

/* GET users listing. */
router.get('/', Auth.verifyToken, Controller.getPosts);
router.post('/', Auth.verifyToken, Controller.registerPost);
router.put('/:id', Auth.verifyToken, Controller.updatePost);
router.put('/', Auth.verifyToken, Controller.updatePosts);
router.post('/delete', Auth.verifyToken, Controller.deletePosts);
router.delete('/:id', Auth.verifyToken, Controller.deletePost);

module.exports = router;
