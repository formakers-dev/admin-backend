const PostsService = require('../services/posts');

const getPosts = (req, res) => {
    PostsService.findPublishablePosts()
        .then(posts => res.json(posts))
        .catch(err => res.status(500).json({error: err.message}));
};

const registerPost = (req, res) => {
    PostsService.insertPost(req.body)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({error: err.message}));
};

module.exports = { getPosts, registerPost };
