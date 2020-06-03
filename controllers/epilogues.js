const EpiloguesService = require('../services/epilogues');

const getEpilogue = (req, res) => {
    EpiloguesService.getEpilogue(req.query.betaTestId)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({error: err.message}));
};

const upsertEpilogue = (req, res) => {
    EpiloguesService.upsertEpilogue(req)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

const deleteEpilogue = (req, res) => {
    EpiloguesService.deleteEpilogue(req)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

module.exports = {
    getEpilogue,
    upsertEpilogue,
    deleteEpilogue
};
