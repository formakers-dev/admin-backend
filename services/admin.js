const Account = require('../models/account').Account;
const Constants = require('../models/account').Constants;
const bcrypt = require('bcrypt');
const JWT = require('../util/jwt');

const getAssignees = (req, res) => {

    Account.find({}, {"account":1, "nickName":1}).lean().sort({nickName:1}).then(result => {
        if(!result){
            return res.sendStatus(204);
        }
        return res.status(200).json(result);
    }).catch(error => {
        console.error(error);
        throw error;
    });
};

const getProfile = (req, res)=>{
    const id = JWT.verify(req.headers.authorization).id;
    Account.findOne({_id:id}, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        if (result) {
            const body = {
                email : result.account,
                nickName: result.nickName
            };
            return res.status(200).json(body);
        }else{
            return res.status(401).json({
                error: '존재하지 않는 사용자입니다.'
            });
        }
    });
}

const updateProfile = (req, res)=>{
    const id = JWT.verify(req.headers.authorization).id;
    Account.findOne({_id:id}, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        if(!req.body.currentPw){
            return res.status(400).json({
                error: '잘못된 비밀번호 입니다.'
            });
        }
        const isValidPassword = bcrypt.compareSync(req.body.currentPw, result.password);
        if (result && isValidPassword) {
            const params = {
                nickName : req.body.nickName
            };
            result.nickName = req.body.nickName;
            let password = result.password;
            if(req.body.password){
                password = bcrypt.hashSync(req.body.password, Constants.SALT_ROUNDS);
                params.password = password;
            }
            Account.updateOne({_id:id}, {$set: params}).then(result => {
                return res.sendStatus(200);
            }).catch(err => {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            });
        }else{
            return res.status(400).json({
                error: '잘못된 비밀번호 입니다.'
            });
        }
    });
}

module.exports = {
    getAssignees, updateProfile, getProfile
};

