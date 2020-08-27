const AppUsagesService = require('../services/app-usages');

const getGameAppUsages = (req, res) => {
  console.log(req.query)
  let getPromise;
  if (req.query.app_name) {
    getPromise = AppUsagesService.getAllByAppName(req.query.app_name);
  } else {
    getPromise = AppUsagesService.getAll();
  }

  getPromise.then(results => res.json(results))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: err.message});
    })
};

module.exports = {
  getGameAppUsages
};
