const AwardRecordsService = require('../services/award-records');
const PointsService = require('../services/points');
const NotExistUser = require('../services/users').NotExistUser;

const getAwardRecords = (req, res) => {

  let getAwardRecordsPromise;

  if (req.path.startsWith('/user')) {
    getAwardRecordsPromise = AwardRecordsService.getAwardRecordsByUserId(req.params.id)
  } else if (req.path.startsWith('/beta-test')) {
    getAwardRecordsPromise = AwardRecordsService.getAwardRecordsByBetaTestId(req.params.id)
  } else {
    getAwardRecordsPromise = AwardRecordsService.getAwardRecords()
  }

  getAwardRecordsPromise
        .then(result => res.json(result))
        .catch(err => res.status(500).json({error: err.message}));
};

const registerAwardRecords = (req, res) => {
    const betaTest = req.body.betaTest;
    const award = req.body.award;
    const reward = req.body.reward;
    const userIdentifierType = req.body.userIdentifier.type;

    if (userIdentifierType !=='email' && userIdentifierType !=='userId' && userIdentifierType !=='nickName') {
        return res.status(400).json({error:'잘못된 타입입니다.'});
    }

    let responseData;

    AwardRecordsService.registerAwardRecords(req.body.userIdentifier, betaTest.id, award, reward)
      .then(awardRecords => {
          responseData = awardRecords;

          if (reward.paymentType === "point") {
            const uniqueIds = awardRecords.map(awardRecord => {
              return {
                userId: awardRecord.userId,
                awardRecordId: awardRecord._id,
              };
            });
            const pointDescription = betaTest.title + " - " + award.typeName;
            return PointsService.insertManyPointsForSave(uniqueIds, reward.price, pointDescription, betaTest.id);
          } else {
            return Promise.resolve();
          }
      })
      .then(() => res.status(200).json(responseData))
      .catch(err => {
        console.error(err);
        if (err instanceof NotExistUser) {
          res.sendStatus(204);
        } else {
          res.status(500).json({error: err.message});
        }
      });
};

const updateAwardRecords = (req, res) => {
    AwardRecordsService.updateAwardRecords(req)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

const deleteAwardRecords = (req, res) => {
    AwardRecordsService.deleteAwardRecords(req)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

module.exports = {
    getAwardRecords,
    registerAwardRecords,
    updateAwardRecords,
    deleteAwardRecords
};
