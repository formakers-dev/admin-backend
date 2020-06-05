const mongoose = require('mongoose');
const BetaTests = require('../models/betaTests');

const getEpilogue = (betaTestId) => {
    return BetaTests.findOne({"_id" : mongoose.Types.ObjectId(betaTestId)})
        .then(betaTest => betaTest.epilogue);
};

const upsertEpilogue = (betaTestId, epilogue) => {
    delete epilogue.betaTestId;
    return BetaTests.updateOne({_id : mongoose.Types.ObjectId(betaTestId)}, {$set: {epilogue : epilogue}});
};

const deleteEpilogue = (betaTestId) => {
    return BetaTests.updateOne({_id : mongoose.Types.ObjectId(betaTestId)}, {$unset: {epilogue : ""}});
};

module.exports = {
    getEpilogue,
    upsertEpilogue,
    deleteEpilogue
};
