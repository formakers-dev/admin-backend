const mongoose = require('mongoose');
const Posts = require('../models/posts');

const findPublishablePosts = () => {
    return Posts.find().sort({ order : 1 })
};

const insertPost = (post) => {
    console.log('insertPost');
    return new Posts(post).save();
};

const updatePost = (req) => {
    console.log('updatePost');
    console.log(req.body);
    return Posts.replaceOne({_id: req.params.id}, req.body);
};

const deletePost = (req) => {
    console.log('deletePost');
    console.log(req.params.id);
    return Posts.deleteOne({_id: req.params.id});
};

const deletePosts = (req) => {
    console.log('deletePosts');
    console.log(req.body);
    const objectIds = req.body.map(id => mongoose.Types.ObjectId(id));
    return Posts.deleteMany({_id: { $in: objectIds}});
};

const updatePosts = (req) => {
    console.log('updatePosts');
    console.log(req.body);
    const promises = req.body.map(item=>{
       return Posts.replaceOne({_id: item._id}, item);
    });
    return Promise.all(promises);
};

module.exports = {
    findPublishablePosts,
    insertPost,
    updatePost,
    updatePosts,
    deletePost,
    deletePosts
};

