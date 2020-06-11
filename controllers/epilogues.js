const EpiloguesService = require('../services/epilogues');

const getEpilogue = (req, res) => {
    EpiloguesService.getEpilogue(req.params.betaTestId)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({error: err.message}));
};

const upsertEpilogue = (req, res) => {
    EpiloguesService.upsertEpilogue(req.params.betaTestId, req.body)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

const deleteEpilogue = (req, res) => {
    EpiloguesService.deleteEpilogue(req.params.betaTestId)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

module.exports = {
    getEpilogue,
    upsertEpilogue,
    deleteEpilogue
};
