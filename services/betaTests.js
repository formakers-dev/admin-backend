const ObjectId = require('mongoose').Types.ObjectId;
const BetaTests = require('../models/betaTests');

const insertBetaTest = (betaTest) => {
    betaTest._id = getNewObjectId();
    return new BetaTests(betaTest).save();
};

const getNewObjectId = () => {
    return new ObjectId();
};

module.exports = {
    getNewObjectId,
    insertBetaTest
};

