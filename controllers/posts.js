const PostsService = require('../services/posts');

const getPosts = (req, res) => {
    PostsService.findPublishablePosts()
        .then(posts => res.json(posts))
        .catch(err => res.status(500).json({error: err.message}));
};

const registerPost = (req, res) => {
    PostsService.insertPost(req.body)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

const updatePost = (req, res) => {
    PostsService.updatePost(req)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

const deletePost = (req, res) => {
    PostsService.deletePost(req)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

const deletePosts = (req, res) => {
    PostsService.deletePosts(req)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

const updatePosts = (req, res) => {
    PostsService.updatePosts(req)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};
module.exports = { getPosts, registerPost, updatePost, deletePost, deletePosts, updatePosts };
