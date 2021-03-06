const Participations = require('../models/participants');
const AwardRecords = require('../models/award-records');
const Users = require('../models/users').Users;
const BetaTests = require('../models/betaTests');

const getParticipants = (req) => {
    let sort = 'asc';
    if(req.query.sort){
        if(req.query.sort === 'desc'){
            sort = 'desc'
        }
    }
    if(req.query.path === 'overview'){
        const filter = req.query
        delete filter.path;
        return Participations.find(filter).lean().sort({date: 1}).then(results=>{
            const data = {
                participants:results
            };
            return Promise.resolve(data);
        }).catch(err => Promise.reject(err));
    } else if(req.query.groupBy === 'beta-test'){
        const firstMatch = { type: 'beta-test'};
        if(req.query.status){
            firstMatch.status = req.query.status;
        }
        return Participations.aggregate([
            { $match: firstMatch},
            { $lookup : {
                    from: 'beta-tests',
                    localField: 'betaTestId',
                    foreignField: '_id',
                    as: 'betaTest'
            }},
            { $unwind:'$betaTest'},
            { $project : { status: 1 , betaTestId: 1, type:1, date: 1, betaTest:{title:1, openDate:1, closeDate:1}}},
            { $group: {
                    _id : {betaTestId : '$betaTestId', title: '$betaTest.title', openDate: '$betaTest.openDate', closeDate: '$betaTest.closeDate'},
                    totalAttendCount: {$sum:{$cond : {if: {$eq: [ "$status", 'attend' ]}, then: 1, else:0}}},
                    totalCompleteCount: {$sum: {$cond : {if: {$eq: [ "$status", 'complete' ]}, then: 1, else:0}}},
                }
            },
            { $sort : { '_id.closeDate' : sort === 'asc' ? 1 : -1}},
            { $limit: req.query.limit ? Number(req.query.limit) : Number.MAX_SAFE_INTEGER},
        ]).then(results=>{
            const data = {
                participants:results
            };
            return Promise.resolve(data);
        }).catch(err => Promise.reject(err));
    } else {
        let sort = 'asc';
        if(req.query.sort){
            if(req.query.sort === 'desc'){
                sort = 'desc'
            }
        }
        return Participations.aggregate([
            { $match: req.query},
            { $lookup : {
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'user'
            }},
            { $unwind:'$user'},
            { $lookup : {
                    from: 'beta-tests',
                    localField: 'betaTestId',
                    foreignField: '_id',
                    as: 'betaTest'
            }},
            { $unwind:'$betaTest'},
            { $project : { status: 1 , type:1, date: 1, betaTestId: 1, user:{ userId:1, gender:1, birthday:1, job:1}, betaTest:{title:1, openDate:1, closeDate:1, plan:1}}},
            { $sort : { date : sort === 'asc' ? 1 : -1}}
        ]).then(results=>{
            const data = {
                participants:results
            };
            return Promise.resolve(data);
        }).catch(err => Promise.reject(err));
    }
};

const getAwardRecords = (req) => {
    if(req.query.filters){
        const filters = req.query.filters.split(',');
        if(filters.indexOf('totalPrice') >-1){
            const query =[
                {  $match: {"reward.price":{ "$exists":true, "$ne":null}}},
                {  $group: {'_id' : 'null',"totalPrice":{$sum: "$reward.price"}}}
                ];
            if(req.query.betaTestId){
                query[0]['$match']['betaTestId'] = req.query.betaTestId;
            }
            return AwardRecords.aggregate(query).then(results=>{
                const data = {
                    totalAwardRecordPrice: results.length > 0 ? results[0].totalPrice : 0
                };
                return Promise.resolve(data);
            }).catch(err => Promise.reject(err));
        }else{
            return Promise.reject({message:'invalid filters'});
        }
    }else{
        let sort = 'asc';
        if(req.query.sort){
            if(req.query.sort === 'desc'){
                sort = 'desc'
            }
        }
        const query = [
            { $lookup : {
                    from: 'award-records',
                    localField: '_id',
                    foreignField: 'betaTestId',
                    as: 'awardRecords'
                }},
            { $project : { _id:1, title: 1 , openDate: 1, closeDate: 1, awardRecords: {userId:1, reward:{price:1}} } },
            { $sort: {closeDate: sort === 'asc' ? 1 : -1}},
            { $limit: req.query.limit ? Number(req.query.limit) : Number.MAX_SAFE_INTEGER},
            { $addFields : {
                totalPrice: {$sum: '$awardRecords.reward.price'}
            }}
        ];
        return BetaTests.aggregate(query).then(results=>{
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
    return BetaTests.find({},{title:1, subjectType:1, plan:1}).lean().then(results=>{
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

