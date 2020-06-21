const Participations = require('../models/participants');
const AwardRecords = require('../models/award-records');
const Users = require('../models/users').Users;
const BetaTests = require('../models/betaTests');

const getParticipants = (req) => {
    if(req.query.path === 'overview'){
        const filter = req.query
        delete filter.path;
        return Participations.find(filter).lean().sort({date: 1}).then(results=>{
            const data = {
                participants:results
            };
            return Promise.resolve(data);
        }).catch(err => Promise.reject(err));
    }else{
        const currentDate = new Date();
        return BetaTests.aggregate([
            { $match: {openDate :{ $lte : currentDate}}},
            { $lookup : {
                    from: 'participations',
                    localField: '_id',
                    foreignField: 'betaTestId',
                    as: 'participants'
                }},
            { $project : { title: 1 , openDate: 1, closeDate: 1, participants: 1 } },
            {$sort: {closeDate: -1}},
            { $limit : 10}
        ]).then(results=>{
            const data = {
                betaTests:results
            };
            return Promise.resolve(data);
        }).catch(err => Promise.reject(err));
    }
};

const getAwardRecords = (req) => {
    if(req.query.filters){
        const filters = req.query.filters.split(',');
        if(filters.indexOf('totalPrice') >-1){
            return AwardRecords.aggregate([
                {
                    "$match": {
                        "reward.price":{
                            "$exists":true,
                            "$ne":null
                        }
                    }
                },
                {
                    "$group": {
                        '_id' : 'null',
                        "totalPrice":{"$sum": "$reward.price"}
                    }
                }
            ]).then(results=>{
                const data = {
                    totalAwardRecordPrice: results[0].totalPrice
                };
                return Promise.resolve(data);
            }).catch(err => Promise.reject(err));
        }else{
            return Promise.reject({message:'invalid filters'});
        }
    }else{
        const currentDate = new Date();
        return BetaTests.aggregate([
            { $match: {openDate :{ $lte : currentDate}}},
            { $lookup : {
                    from: 'award-records',
                    localField: '_id',
                    foreignField: 'betaTestId',
                    as: 'awardRecords'
            }},
            { $project : { title: 1 , openDate: 1, closeDate: 1, awardRecords: 1 } },
            {$sort: {closeDate: 1}}
        ]).then(results=>{
            const data = {
                betaTests:results
            };
            return Promise.resolve(data);
        }).catch(err => Promise.reject(err));
    }
};

const getUsers = (req) => {
    return Users.find({},{
        "gender": 1,
        "signUpTime": 1,
        "job": 1,
        "birthday": 1,
        "activatedDate": 1,
        "appVersion": 1
    }).sort({signUpTime : 1}).lean().then(results=>{
        const data = {
            users: results
        };
        return Promise.resolve(data);
    }).catch(err => Promise.reject(err));
};

const getBetaTests = (req) =>{
    return BetaTests.find().lean().then(results=>{
        const data = {
            betaTests: results
        };
        return Promise.resolve(data);
    }).catch(err => Promise.reject(err));
}

module.exports = {
    getParticipants,
    getAwardRecords,
    getUsers,
    getBetaTests
};

