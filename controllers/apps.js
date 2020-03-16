const AppsService = require('../services/apps');

const getApp = (req, res) => {
    AppsService.getApp(req.params.packageName)
        .then(app => res.json(app))
        .catch(err => {
            console.error(err);
            res.send(err);
        });
};

module.exports = { getApp };
