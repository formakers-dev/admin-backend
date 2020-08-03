const AwardRecordsService = require('../services/award-records');
const PointsService = require('../services/points');
const NotExistUser = require('../services/users').NotExistUser;

const getAwardRecords = (req, res) => {
    AwardRecordsService.getAwardRecords(req)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({error: err.message}));
};

const registerAwardRecords = (req, res) => {
    const betaTestId = req.body.betaTestId;
    const award = req.body.award;
    const reward = req.body.reward;
    const userIdentifierType = req.body.userIdentifier.type;

    if (userIdentifierType !=='email' && userIdentifierType !=='userId' && userIdentifierType !=='nickName') {
        return res.status(400).json({error:'잘못된 타입입니다.'});
    }

    let users;

    AwardRecordsService.registerAwardRecords(req.body.userIdentifier, betaTestId, award, reward)
      .then(users => {
          this.users = users;

          if (reward.paymentType === "point") {
            const userIds = users.map(user => user.userId);
            return PointsService.insertManyPointsForSave(userIds, reward.price, reward.description, 'beta-test', betaTestId);
          } else {
            return Promise.resolve();
          }
      })
      .then(() => res.status(200).json(users))
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
