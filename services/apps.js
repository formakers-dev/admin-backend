const Apps = require('../models/apps');

const getApp = (packageName) => {
    console.log(packageName);
    return Apps.findOne({packageName: packageName});
};

module.exports = {
    getApp
};
