const Account = require('../models/account').Account;
const Constants = require('../models/account').Constants;
const bcrypt = require('bcrypt');
const JWT = require('../util/jwt');

const login = (req, res) => {
    const account = req.body.email;
    const pw = req.body.password;
    Account.findOne({account: account}, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: err.message});
        }

        if (!result) {
            return res.status(401).json({
                error: "계정정보가 존재하지 않습니다."
            });
        }

        switch (result.status) {
            case Constants.STATUS.PENDING:
                return res.status(401).json({
                    error: "가입 검토 중입니다."
                });
            case Constants.STATUS.INACTIVE:
                return res.status(401).json({
                    error: "정지된 계정입니다."
                });
            case Constants.STATUS.LOCKED:
                return res.status(401).json({
                    error: "잠긴 계정입니다."
                });
        }
        if (bcrypt.compareSync(pw, result.password)) {
            //reset invalid count and status
            const params = {
                status: Constants.STATUS.ACTIVE,
                invalidPasswordCount: 0
            }
            Account.updateOne({_id: result._id}, {$set: params}).then(result => {
            }).catch(err => {
                console.error(err);
                return res.status(500).json({
                    error: err.message
                });
            });
            const token =JWT.generateToken(req, res,{id: result._id});
            res.setHeader('Authorization', token);
            return res.sendStatus(200);
        } else {
            const prevInvalidCount = result.invalidPasswordCount;
            const currInvalidCount = prevInvalidCount + 1;
            if (prevInvalidCount < 2) {
                Account.updateOne({account: account}, {$set: {invalidPasswordCount: currInvalidCount}}).then(result => {
                }).catch(err => {
                    console.error(err);
                    return res.status(500).json({
                        error: err.message
                    });
                });
            } else {
                const params = {
                    status: Constants.STATUS.LOCKED,
                    invalidPasswordCount: currInvalidCount
                }
                Account.updateOne({account: account}, {$set: params}).then(result => {
                }).catch(err => {
                    console.error(err);
                    return res.status(500).json({
                        error: err.message
                    });
                });
            }
            return res.status(401).json({
                error: "잘못된 비밀번호 입니다. 3회이상 잘못 입력할 경우 계정이 잠깁니다.(" + currInvalidCount + "/3)"
            });
        }
    })
};

const signUp = (req, res) => {
    // password encryption
    const account = req.body.email;
    const nickName = req.body.nickName;
    const pw = req.body.password;
    const encryptedPw = bcrypt.hashSync(pw, Constants.SALT_ROUNDS);
    Account.findOne({account: account}, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        if (result) {
            return res.status(400).json({
                error: "이미 가입된 계정입니다."
            });
        } else {
            new Account({
                account: account,
                nickName: nickName,
                password: encryptedPw,
                status: Constants.STATUS.PENDING,
                createAt: new Date(),
                role: Constants.ROLE.MASTER,
                invalidPasswordCount: 0
            }).save().then(result => {
                return res.sendStatus(201)
            }).catch(err => {
                console.error(err);
                return res.status(500).json({error: err.message});
            });
        }
    });
}

const logout = (req, res) => {
    res.clearCookie('access_token');
    res.removeHeader('Authorization');
    return res.sendStatus(204);
}

const check = (req, res) => {
    return res.sendStatus(200);
}


module.exports = {
    login, signUp, logout, check
};

