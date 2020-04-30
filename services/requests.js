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
            "company.numberOfEmployee" : 1,
            "isCancelled": 1
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
    try{
        const data = {
            date : request.date,
            status : request.status ? request.status : 'received',
            purpose : request.purpose ? request.purpose : request.betaTest.purpose,
            plan : request.plan ? request.plan : request.betaTest.plan,
            numberOfTester : request.numberOfTester,
            openDate : request.openDate ? request.openDate : request.betaTest.openDate,
            duration : request.duration ? request.duration : request.betaTest.duration,
            additionalInfo : request.additionalInfo ? request.additionalInfo : request.betaTest.additionalInfo,
            isIncludedUserData : request.isIncludedUserData,
            isIncludedCustomizing : request.customizing ? request.customizing.isIncluded : request.isIncludedCustomizing,
            customizingManagerEmails : request.customizingManagerEmails ? request.customizingManagerEmails :  request.customizing.managerEmails,
            game : {
                title : request.game.title,
                tags : request.game.tags,
                description : request.game.description,
                downloadUrl : request.game.downloadUrl,
                packageName : request.game.packageName,
                devProcess : request.game.devProcess,
            },
            company : {
                name : request.company.name ? request.company.name : request.customer.company.name,
                class : request.company.class ? request.company.class : request.customer.company.class,
                numberOfEmployee : request.company.numberOfEmployee ? request.company.numberOfEmployee : request.customer.company.numberOfEmployee,
            },
            customer : {
                referers : request.customer.referers,
                name : request.customer.name,
                role : request.customer.role,
                phoneNumber : request.customer.phoneNumber,
                email : request.customer.email,
            },
            operatorAccountId : request.operatorAccountId,
            operatorName : request.operatorName,
            isCancelled: request.isCancelled
        };
        return new Requests(data).save();
    }catch(err){
        throw err;
    }
};

const updateRequest = (id, request) => {
    console.log('updateRequest');
    return Requests.replaceOne({_id: id}, request);
};

const cancelRequest = (id) => {
    console.log('cancelRequest');
    return Requests.updateOne({_id: id}, {$set: {isCancelled:true}});
};

module.exports = {
    getRequests,
    getRequest,
    insertRequest,
    updateRequest,
    cancelRequest
};

