const Posts = require('../models/posts');

const findPublishablePosts = () => {
    const currentDate = new Date();

    return Posts.find({ $and: [
            { openDate : { $lte : currentDate } },
            { closeDate : { $gte : currentDate } }
        ]}).sort({ order : 1 })
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
    const objectIds = req.body.map(id => mongoose.Types.ObjectId(id));
    return Posts.deleteMany({_id: { $in: objectIds}});
};

module.exports = {
    findPublishablePosts,
    insertPost,
    updatePost,
    deletePost,
    deletePosts
};

