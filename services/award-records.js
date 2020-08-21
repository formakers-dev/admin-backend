const AwardRecords = require('../models/award-records');
const BetaTests = require('../models/betaTests');
const Users = require('../models/users').Users;
const NotExistUser = require('../services/users').NotExistUser;

const getAwardRecords = () => {
    return AwardRecords.find({}).lean();
};

const getAwardRecordsByBetaTestId = (betaTestId) =>{
    const promises = [];
    const betaTest = BetaTests.findOne({_id : betaTestId});
    const awardRecords = AwardRecords.find({betaTestId: betaTestId}).lean();
    promises.push(betaTest);
    promises.push(awardRecords);
    return Promise.all(promises).then(results =>{
        const data = {};
        data['betaTest'] = results[0];
        data['awardRecords'] = results[1];
        return Promise.resolve(data);
    }).catch(err => Promise.reject(err));
};

const getAwardRecordsByUserId = (userId) =>{
    return AwardRecords.aggregate([
        { $match: { userId: userId } },
        {
            $lookup: {
                from: 'beta-tests',
                localField: 'betaTestId',
                foreignField: '_id',
                as: 'betaTest'
            }
        }
    ]).then(results=>{
        const data = {};
        data['awardRecords'] = results;
        return Promise.resolve(data);
    }).catch(err => Promise.reject(err));
};

const registerAwardRecords = (userIdentifier, betaTestId, award, reward) => {
    const filter = {};
    filter[userIdentifier.type] = {$in: userIdentifier.data};

    let users;

    return Users.find(filter, {userId: 1, nickName: 1, email: 1})
      .lean()
      .then(result => {
          users = result;
          console.log(users);

          if (!users || users.length <= 0) {
              return Promise.reject(new NotExistUser());
          }

          const awardRecords = users.map(e => {
              return {
                  userId: e.userId,
                  betaTestId: betaTestId,
                  type: award.type,
                  typeCode: award.typeCode,
                  nickName: e.nickName,
                  reward: {
                      description: reward.description,
                      price: reward.price,
                      paymentType: reward.paymentType
                  }
              };
          });

          return AwardRecords.insertMany(awardRecords)
      }).then(() => Promise.resolve(users));
};

const updateAwardRecords = (req) => {
    return AwardRecords.replaceOne({_id: req.body._id}, req.body);
};

const deleteAwardRecords = (req) => {
    return AwardRecords.deleteMany({_id: { $in: req.body}});
};

module.exports = {
    getAwardRecords,
    getAwardRecordsByBetaTestId,
    registerAwardRecords,
    updateAwardRecords,
    deleteAwardRecords,
    getAwardRecordsByUserId
};

