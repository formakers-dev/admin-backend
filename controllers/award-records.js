const AwardRecordsService = require('../services/award-records');

const getAwardRecords = (req, res) => {
    AwardRecordsService.getAwardRecords(req)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({error: err.message}));
};

const registerAwardRecords = (req, res) => {
    try{
        return AwardRecordsService.registerAwardRecords(req, res)
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
};

const updateAwardRecords = (req, res) => {
    AwardRecordsService.updateAwardRecords(req)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

const deleteAwardRecords = (req, res) => {
    AwardRecordsService.deleteAwardRecords(req)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

module.exports = {
    getAwardRecords,
    registerAwardRecords,
    updateAwardRecords,
    deleteAwardRecords
};
