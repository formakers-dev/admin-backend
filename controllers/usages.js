const AppUsagesService = require('../services/app-usages');

const getGameAppUsages = (req, res) => {
  AppUsagesService.getAll()
    .then(results => res.json(results))
    .catch(err => {
      console.error(err);
      res.status(500).json({error : err.message});
    })
};

module.exports = {
  getGameAppUsages
};
