const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const config = require('../config');

const sendCrawlingCommand = (packageName) => {
    return new Promise((resolve, reject) => {
        const params = {
            DocumentName: 'AWS-RunShellScript',
            InstanceIds: [config.crawler.instanceId],
            MaxConcurrency: '50',
            MaxErrors: '0',
            Parameters: {
                'commands': [config.crawler.command + ' ' + packageName],
                'workingDirectory':[config.crawler.workingDir],
                'executionTimeout':['3600']
            },
            TimeoutSeconds: '300'
        };

        ssm.sendCommand(params, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = { sendCrawlingCommand };
