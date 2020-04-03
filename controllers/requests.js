const RequestService = require('../services/requests');

const getRequests = (req, res) => {
    RequestService.findAllRequests()
        .then(result => {
            console.log(result);
            res.json(result)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

module.exports = {
    getRequests
};
