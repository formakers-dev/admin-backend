const PointRecords = require('../models/point-records').Model;

const findPoints = (type) => {
  return PointRecords.find({
    type: type
  })
};

module.exports = {
  findPoints,
};
