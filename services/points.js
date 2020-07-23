const PointRecords = require('../models/point-records').Model;
const PointConstant = require('../models/point-records').Constants;

const findPoints = (type) => {
    return PointRecords.find({
        type: type
    })
};

const updateOperationDataForExchange = (id, operationData) => {
  return PointRecords.updateOne({_id : id, type: PointConstant.TYPE.EXCHANGE},{
          $set : {
              "status" : convertPointExchangeStatus(operationData.operationStatus),
              "operationData" : {
                  "status": operationData.operationStatus,
                  "operatorAccount" : operationData.operatorAccount,
                  "memo" : operationData.memo
              },
          }
      });
};

const convertPointExchangeStatus = (operationStatus) => {
    if(operationStatus === PointConstant.OPERATION_STATUS.COMPLETED) {
        return PointConstant.STATUS.COMPLETED;
    } else {
        return PointConstant.STATUS.REQUESTED;
    }
};

module.exports = {
    findPoints,
    updateOperationDataForExchange
};
