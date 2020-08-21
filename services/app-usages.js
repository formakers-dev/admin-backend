const AppUsages = require('../models/app-usages');

const getAll = () => {
  return AppUsages.find({}).lean();
};

module.exports = {
  getAll,
};
