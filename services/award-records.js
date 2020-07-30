const AwardRecords = require('../models/award-records');
const BetaTests = require('../models/betaTests');
const Users = require('../models/users').Users;

const getAwardRecords = (req) => {
    const path = req.query.path;
    if(path === 'user'){
        return getAwardRecordsByUserId(req);
    }else if(path === 'beta-test'){
        return getAwardRecordsByBetaTestId(req);
    }
};

const getAwardRecordsByBetaTestId = (req) =>{
    const promises = [];
    const betaTest = BetaTests.findOne({_id : req.query.betaTestId});
    const awardRecords = AwardRecords.find({betaTestId:  req.query.betaTestId}).lean();
    promises.push(betaTest);
    promises.push(awardRecords);
    return Promise.all(promises).then(results =>{
        const data = {};
        data['betaTest'] = results[0];
        data['awardRecords'] = results[1];
        return Promise.resolve(data);
    }).catch(err => Promise.reject(err));
};

const getAwardRecordsByUserId = (req) =>{
    return AwardRecords.aggregate([
        { $match:{userId:req.query.userId}},
        { $lookup : {
                from: 'beta-tests',
                localField: 'betaTestId',
                foreignField: '_id',
                as: 'betaTest'
            }}
    ]).then(results=>{
        const data = {};
        data['awardRecords'] = results;
        return Promise.resolve(data);
    }).catch(err => Promise.reject(err));
}

const registerAwardRecords = (req, res) => {
    const userIdentifierType = req.body.userIdentifierType;
    const userIdentifiers = req.body.userIdentifiers;
    if (userIdentifierType !=='email' && userIdentifierType !=='userId' && userIdentifierType !=='nickName') {
        return res.status(400).json({error:'잘못된 타입입니다.'});
    }

    const filter = {};
    filter[userIdentifierType] = {$in: userIdentifiers};

    let users;

    Users.find(filter, {userId: 1, nickName: 1, email: 1})
      .lean()
      .then(result => {
          users = result;
          console.log(users);

          if (!users) {
              return res.sendStatus(204);
          }

          const awardRecords = users.map(e => {
              return {
                  userId: e.userId,
                  betaTestId: req.body.betaTestId,
                  type: req.body.type,
                  typeCode: req.body.typeCode,
                  nickName: e.nickName,
                  reward: {
                      description: req.body.reward.description,
                      price: req.body.reward.price,
                      paymentType: req.body.reward.paymentType
                  }
              };
          });

          return AwardRecords.insertMany(awardRecords)
      })
      .then(() => res.status(200).json(users))
      .catch(e => {
          throw e;
      });
};

const updateAwardRecords = (req) => {
    return AwardRecords.replaceOne({_id: req.body._id}, req.body);
};

const deleteAwardRecords = (req) => {
    return AwardRecords.deleteMany({_id: { $in: req.body}});
};

module.exports = {
    getAwardRecords,
    registerAwardRecords,
    updateAwardRecords,
    deleteAwardRecords,
    getAwardRecordsByUserId
};

