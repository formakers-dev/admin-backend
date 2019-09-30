const ObjectId = require('mongoose').Types.ObjectId;
const BetaTests = require('../models/betaTests');

const getNewObjectId = () => {
    return new ObjectId();
};

const insertBetaTest = (betaTest) => {
    betaTest._id = getNewObjectId();
    return new BetaTests(betaTest).save();
};

const findAllBetaTest = () => {
    return BetaTests.find({});
}

module.exports = {
    getNewObjectId,
    insertBetaTest,
    findAllBetaTest,
};

