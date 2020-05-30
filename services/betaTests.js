const MongooseUtil = require('../util/mongoose');
const BetaTests = require('../models/betaTests');
const BetaTestMissions = require('../models/betaTestMissions');
const Epilogues = require('../models/epilogues');

const insertBetaTest = (betaTest) => {
    console.info('Try to insert BetaTest...');
    const betaTestId = MongooseUtil.getNewObjectId();
    console.log(betaTest);

    return processMissions(betaTestId, betaTest.missions, 'create')
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

const findAllBetaTest = () => {
    return BetaTests.find({},{
        'openDate':1,
        'title':1,
        'closeDate':1,
        'plan':1,
        'iconImageUrl':1,
        'status':1,
        'subjectType':1
    }).lean().sort({openDate: -1});
};

const processMissions = (betaTestId, missions, type) => {
    if(type === 'create'){
        const data = missions.map(mission => {
            mission.betaTestId = betaTestId;
            return mission;
        });
        return BetaTestMissions.create(data);
    }else if(type === 'update'){
        return BetaTestMissions.deleteMany({betaTestId: betaTestId}).then(result=>{
            const data = missions.map(mission => {
                mission._id = MongooseUtil.getNewObjectId();
                mission.betaTestId = betaTestId;
                return mission;
            });
            console.log('insert', data);
            return BetaTestMissions.create(data);
        })
    }
};

const updateBetaTest = (betaTest) => {
    return processMissions(betaTest._id, betaTest.missions, 'update')
        .then(results => {
            console.info('Missions are successfully updated!');
            delete betaTest.missions;
            return BetaTests.replaceOne({_id: betaTest._id}, betaTest);
        })
        .catch(err => {
            console.error(err);
            return Promise.reject(err);
        });
};

const findBetaTest = (id) => {
    const promises = [];
    const betaTest = BetaTests.findOne({_id:id});
    const missions = BetaTestMissions.find({betaTestId:id}).lean().sort({order:1});
    promises.push(betaTest);
    promises.push(missions);
    return Promise.all(promises).then(results =>{
        const data = Object.assign({}, results[0]._doc);
        data['missions'] = results[1];
        return Promise.resolve(data);
    }).catch(err => Promise.reject(err));
};

module.exports = {
    insertBetaTest,
    updateBetaTest,
    findAllBetaTest,
    findBetaTest
};

