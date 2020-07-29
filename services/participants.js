const Participations = require('../models/participants');
const Users = require('../models/users').Users;
const mongoose = require('mongoose');

const getParticipants = (req) => {
    return Participations.find(req.query).lean().sort({ date : -1 });
};

const registerParticipants = (body) => {
    const betaTestId = body.betaTestId;
    const missionId = body.missionId;
    const type = body.type;
    const ids = body.ids;
    const status = body.status;
    const date = body.date ? body.date : new Date();
    let data = [];
    if(body.userKey === 'email'){
        return Users.find({email : {$in:ids}}, {userId:1},{lean:true},(err,result)=>{
            if(err){
                console.error(err);
                return Promise.reject(err);
            }
            data = result.map((el)=>{
                return {
                    userId: el.userId,
                    betaTestId: betaTestId,
                    missionId: missionId,
                    type: type,
                    status:status,
                    date: date
                }
            });
            return Participations.insertMany(data);
        });
    }else{
        data = ids.map((el)=>{
            return {
                userId: el,
                betaTestId: betaTestId,
                missionId: missionId,
                type: type,
                status:status,
                date: date
            }
        });
        return Participations.insertMany(data);
    }

};

const deleteParticipant = (id)=>{
    return Participations.deleteOne({_id:id});
};

const deleteParticipantForBetaTest = (betaTestId, userId) => {
    return Participations.deleteMany({betaTestId: betaTestId, userId: userId});
};

module.exports = {
    getParticipants,
    registerParticipants,
    deleteParticipant,
    deleteParticipantForBetaTest,
};

