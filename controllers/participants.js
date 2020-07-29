const service = require('../services/participants');

const getParticipants = (req, res) => {
    service.getParticipants(req)
        .then(requests => res.json(requests))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

const registerParticipants = (req, res) => {
    service.registerParticipants(req.body)
        .then(result => res.sendStatus(200))
        .catch(err => {
            res.status(500).json({error: err.message});
        });
};

const deleteParticipant = (req, res) => {
    service.deleteParticipant(req.params.id)
        .then(result => res.sendStatus(200))
        .catch(err => {
            res.status(500).json({error: err.message});
        });
};

const deleteParticipantForBetaTest = (req, res) => {
    const betaTestId = req.params.betaTestId;
    const userId = req.params.userId;

    if (!!!betaTestId || !!!userId) {
        return res.status(412).json({error:'요청 정보가 사전 조건을 충족하지 않습니다.'});
    }

    service.deleteParticipantForBetaTest(betaTestId, userId)
        .then(result => res.sendStatus(200))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

module.exports = {
    getParticipants,
    registerParticipants,
    deleteParticipant,
    deleteParticipantForBetaTest,
};
