const service = require('../services/points');
const PointConstants = require('../models/point-records').Constants;

const getPoints = (req, res) => {
  let pointType;
  switch(req.query.type) {
    case 'exchange':
      pointType = PointConstants.TYPE.EXCHANGE;
      break;
    case 'save':
      pointType = PointConstants.TYPE.SAVE;
      break;
  }

  service.findPoints(pointType)
      .then(points => res.json(points))
      .catch(err => {
          console.error(err);
          res.status(500).json({error: err.message});
      });
};

module.exports = {
  getPoints
};
