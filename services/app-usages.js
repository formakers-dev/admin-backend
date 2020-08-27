const AppUsages = require('../models/app-usages');

const getAll = () => {
  return AppUsages.find({}).lean();
};

const getAllByAppName = (appName) => {
  return AppUsages.find({ appName: { $regex: appName }})
}

module.exports = {
  getAll,
  getAllByAppName,
};
