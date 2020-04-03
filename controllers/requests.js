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

module.exports = {
    getRequests,
    getRequest
};
