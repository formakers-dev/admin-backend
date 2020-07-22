const AppsService = require('../services/apps');

const getApp = (req, res) => {
    AppsService.getApp(req.params.packageName)
        .then(app => {
            if(app) {
                res.json(app);
            } else {
                res.status(404).send();
            }
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
};

module.exports = { getApp };
