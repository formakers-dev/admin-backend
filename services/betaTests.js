const MongooseUtil = require('../util/mongoose');
const BetaTests = require('../models/betaTests');
const BetaTestMissions = require('../models/betaTestMissions');

const insertBetaTest = (betaTest) => {
    console.info('Try to insert BetaTest...');
    const betaTestId = MongooseUtil.getNewObjectId();

    return insertMissions(betaTestId, betaTest.missions)
        .then(results => {
            console.info('Missions are successfully inserted!');
            betaTest._id = betaTestId;
            delete betaTest.missions;
            return new BetaTests(betaTest).save();
        })
        .catch(err => {
            console.error(err);
            return Promise.reject(err);
        });
};

const insertMissions = (betaTestId, missions) => {
    console.info('Try to insert Missions...');
    const data = missions.map(mission => {
        mission.betaTestId = betaTestId;
        return mission;
    });

    return BetaTestMissions.create(data);
};

const findAllBetaTest = () => {
    return BetaTests.find({}).sort({closeDate: -1});
};

module.exports = {
    insertBetaTest,
    findAllBetaTest,
};

