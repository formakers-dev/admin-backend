const MongooseUtil = require('../util/mongoose');
const BetaTests = require('../models/betaTests');
const BetaTestMissions = require('../models/betaTestMissions');

const insertBetaTest = (betaTest) => {
    console.info('Try to insert BetaTest...');
    const betaTestId = MongooseUtil.getNewObjectId();
    console.log(betaTest);

    betaTest.rewards.list = convertRewards(betaTest.rewards.list);

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

const convertRewards = rewardList => {
    return rewardList.map(reward => {
        if (reward.count <= 0) {
            delete reward.count;
        }
        return reward;
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
                mission.betaTestId = betaTestId;
                return mission;
            });
            return BetaTestMissions.create(data);
        });
    }
};

const updateBetaTest = (betaTest) => {
    betaTest.rewards.list = convertRewards(betaTest.rewards.list);

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
    return Promise.all(promises).then(results => {
        const data = Object.assign({}, results[0]._doc);
        data['missions'] = results[1];
        return Promise.resolve(data);
    }).catch(err => Promise.reject(err));
};

const readFeedbackAggregations = async (betaTestId, missionId) => {
    return BetaTestMissions.findOne({
        _id: missionId,
        betaTestId: betaTestId,
    }, {
        feedbackAggregationUrl: 1,
    }).then(async result => {
        const idMatchResults = result.feedbackAggregationUrl.match(/https:\/\/docs\.google\.com\/spreadsheets\/d\/([A-Za-z0-9_-]*)[?]?.*/);
        const sheetId = idMatchResults[1];

        // TODO : 유틸화시켜 리팩토링 필요
        const GoogleSpreadsheet = require('google-spreadsheet').GoogleSpreadsheet;
        const credentials = require('../google-docs-credentials.json');
        const doc = new GoogleSpreadsheet(sheetId);

        await doc.useServiceAccountAuth(credentials);
        await doc.loadInfo();
        console.log(doc.title);
        const sheet = doc.sheetsByIndex[0];

        await sheet.loadHeaderRow();
        const headers = sheet.headerValues;

        const rows = await sheet.getRows();
        const newRows = rows.map((row, index) => {
            const newRow = {
                order: index + 1,
            };

            headers.forEach(header => {
                newRow[header] = row[header];
            })

            return newRow;
        })

        return {
            questions: headers,
            answerRows: newRows,
        };
    }).catch(err => Promise.reject(err));
}


module.exports = {
    insertBetaTest,
    updateBetaTest,
    findAllBetaTest,
    findBetaTest,
    readFeedbackAggregations,
};
