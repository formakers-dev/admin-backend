const Requests = require('../models/requests');
const NotFoundError = require('../util/error').NotFoundError;

const getRequests = () => {
    console.log('getRequests');
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
    console.log('getRequest');
    return Requests.findOne({_id : id})
        .then(request => {
            if (request)
                return Promise.resolve(request)
            else
                throw new NotFoundError('Not found a request for Id!');
        })
        .catch(err => Promise.reject(err));;
};

const insertRequest = (request) => {
    console.log('insertRequest');
    return new Requests({
        date : request.date,
        status : 'received',
        purpose : request.betaTest.purpose,
        plan : request.betaTest.plan,
        numberOfTester : request.numberOfTester,
        openDate : request.betaTest.openDate,
        duration : request.betaTest.duration,
        additionalInfo : request.betaTest.additionalInfo,
        isIncludedUserData : request.isIncludedUserData,
        isIncludedCustomizing : request.customizing.isIncluded,
        customizingManagerEmails : request.customizing.managerEmails,
        game : {
            title : request.game.title,
            tags : request.game.tags,
            description : request.game.description,
            downloadUrl : request.game.downloadUrl,
            packageName : request.game.packageName,
            devProcess : request.game.devProcess,
        },
        company : {
            name : request.customer.company.name,
            class : request.customer.company.class,
            numberOfEmployee : request.customer.company.numberOfEmployee,
        },
        customer : {
            referers : request.customer.referers,
            name : request.customer.name,
            role : request.customer.role,
            phoneNumber : request.customer.phoneNumber,
            email : request.customer.email,
        },
        operatorAccountId : null,
        operatorName : null
    }).save();
};

const updateRequest = (req) => {
    console.log('updateRequest');
    return Requests.replaceOne({_id: req.params.id}, req.body);
};

const cancelRequest = (req) => {
    console.log('updateRequest');
    return Requests.updateOne({_id: req.params.id}, {$set: {status:'cancel'}});
};

module.exports = {
    getRequests,
    getRequest,
    insertRequest,
    updateRequest,
    cancelRequest
};

