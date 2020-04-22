const ObjectId = require('mongoose').Types.ObjectId;

const getNewObjectId = () => {
    return new ObjectId();
};

module.exports = {
    getNewObjectId
};
