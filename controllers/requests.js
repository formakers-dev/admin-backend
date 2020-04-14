const RequestService = require('../services/requests');
const NotFoundError = require('../util/error').NotFoundError;

const getRequests = (req, res) => {
    RequestService.getRequests()
        .then(requests => res.json(requests))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

const getRequest = (req, res) => {
    RequestService.getRequest(req.params.id)
        .then(result => res.json(result))
        .catch(err => {
            console.error(err);
            const errorCode = (err instanceof NotFoundError) ? 404 : 500;
            res.status(errorCode).json({error: err.message});
        });
};

const registerRequest = (req, res) => {
    RequestService.insertRequest(req.body)
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

const updateRequest = (req, res) =>{
    RequestService.updateRequest(req).then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};

const cancelRequest = (req, res) =>{
    RequestService.cancelRequest(req).then(result => res.sendStatus(200))
        .catch(err => res.status(500).json({error: err.message}));
};
module.exports = {
    getRequests,
    getRequest,
    registerRequest,
    updateRequest,
    cancelRequest
};
