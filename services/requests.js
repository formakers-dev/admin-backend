const Requests = require('../models/requests');
const NotFoundError = require('../util/error').NotFoundError;

const getRequests = () => {
    return Requests.find({}, {
            "date" : 1,
            "status" : 1,
            "operatorName" : 1,
            "numberOfTester" : 1,
            "plan" : 1,
            "openDate" : 1,
            "duration" : 1,
            "isIncludedUserData" : 1,
            "isIncludedCustomizing" : 1,
            "game.title" : 1,
            "game.devProcess" : 1,
            "company.name" : 1,
            "company.numberOfEmployee" : 1
        })
        .lean()
        .sort({ date : -1 });
};

const getRequest = (id) => {
    return Requests.findOne({_id : id})
        .then(request => {
            if (request)
                return Promise.resolve(request)
            else
                throw new NotFoundError('Not found a request for Id!');
        })
        .catch(err => Promise.reject(err));;
};

module.exports = {
    getRequests,
    getRequest
};

