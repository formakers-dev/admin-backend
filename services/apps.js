const Apps = require('../models/apps');
const AwsUtil = require('../util/aws');

const getApp = (packageName) => {
    return Apps.findOne({packageName: packageName});
};

const requestCrawling = (packageName) => {
    return AwsUtil.sendCrawlingCommand(packageName);
};

module.exports = {
    getApp,
    requestCrawling
};
