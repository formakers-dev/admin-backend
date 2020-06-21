const service = require('../services/statistics');

const getParticipants = (req, res) => {
    service.getParticipants(req)
        .then(body => res.json(body))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

const getAwardRecords = (req, res) => {
    service.getAwardRecords(req)
        .then(body => res.json(body))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

const getUsers = (req, res) => {
    service.getUsers(req)
        .then(body => res.json(body))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

const getBetaTests = (req, res) => {
    service.getBetaTests(req)
        .then(body => res.json(body))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};
module.exports = {
    getParticipants,
    getAwardRecords,
    getUsers,
    getBetaTests
};
