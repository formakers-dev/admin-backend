const MongooseUtil = require('../util/mongoose');
const BetaTests = require('../models/betaTests');

const insertBetaTest = (betaTest) => {
    betaTest._id = MongooseUtil.getNewObjectId();
    return new BetaTests(betaTest).save();
};

const findAllBetaTest = () => {
    return BetaTests.find({}).sort({closeDate: -1});
};

module.exports = {
    insertBetaTest,
    findAllBetaTest,
};

