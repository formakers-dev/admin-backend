const Posts = require('../models/posts');

const findPublishablePosts = () => {
    const currentDate = new Date();

    return Posts.find({ $and: [
            { openDate : { $lte : currentDate } },
            { closeDate : { $gte : currentDate } }
        ]}).sort({ order : 1 })
};

const insertPost = (post) => {
    console.log(post);
    return new Posts(post).save();
};

module.exports = {
    findPublishablePosts,
    insertPost
};

