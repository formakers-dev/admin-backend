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

const insertManyPointsForSave = (userIds, point, description, refType, refId) =>{
    const pointRecords = userIds.map(userId => {
        return {
            userId: userId,
            date: new Date(),
            point: point,
            type: PointConstant.TYPE.SAVE,
            status: PointConstant.STATUS.COMPLETED,
            description: description,
            metaData: {
                refType: refType,
                refId: refId
            }
        }
    })

    return PointRecords.insertMany(pointRecords);
};

const deleteSavePoints = (bestTestId, userIds) => {
    return PointRecords.remove({
        userId : { $in : userIds },
        type: PointConstant.TYPE.SAVE,
        'metaData.refType': 'beta-test',
        'metaData.refId': bestTestId
    });
};


module.exports = {
    findPoints,
    updateOperationDataForExchange,
    insertManyPointsForSave,
    deleteSavePoints
};
