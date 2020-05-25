const AwardRecords = require('../models/award-records');
const Users = require('../models/users').Users;

const getAwardRecords = (req) => {
    const filter = req.query ? req.query : {};
    return AwardRecords.find(filter).lean();
};

const registerAwardRecords = (req, res) => {
    const userKey = req.body.userKey;
    const keywords = req.body.users;
    if(userKey !=='email' && userKey !=='userId' && userKey !=='nickName'){
        return res.status(400).json({error:'잘못된 타입입니다.'});
    }
    const filter = {};
    filter[userKey] = {$in: keywords};

    const options = {
        lean : true
    };
    Users.find(filter,null,options,(err, result)=>{
        if(err){
            console.error(error);
            throw err;
        }
        if(!result){
            return res.sendStatus(204);
        }
        const data = [];
        result.forEach(e =>{
            data.push({
                userId: e.userId,
                betaTestId: req.body.betaTestId,
                type: req.body.type,
                nickName: e.nickName,
                reward:{
                    description: req.body.reward.description,
                    price: req.body.reward.price
                }
            });
        })
        AwardRecords.insertMany(data).then(r=>{
            return res.status(200).json(data);
        }).catch(e=>{
            throw e;
        });
    });
};

const updateAwardRecords = (req) => {
    console.log(req.body);
    return AwardRecords.replaceOne({_id: req.body._id}, req.body);
};

const deleteAwardRecords = (req) => {
    return AwardRecords.deleteMany({_id: { $in: req.body}});
};

module.exports = {
    getAwardRecords,
    registerAwardRecords,
    updateAwardRecords,
    deleteAwardRecords
};

