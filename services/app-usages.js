const AppUsages = require('../models/app-usages');

const getAll = () => {
  return AppUsages.find({}).lean();
};

const getAllByAppName = (appName) => {
  console.log(appName);
  return AppUsages.find({ appName: { $regex: appName }});
}

const getAllByPackageName = (packageName) => {
  console.log('getAllByPackageName')
  console.log(packageName)
  return AppUsages.find({ packageName: packageName });
}

module.exports = {
  getAll,
  getAllByAppName,
  getAllByPackageName,
};
