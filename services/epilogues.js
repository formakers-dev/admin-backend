const Epilogues = require('../models/epilogues');

const getEpilogue = (betaTestId) => {
    return Epilogues.findOne({betaTestId: betaTestId}).lean();
};

const upsertEpilogue = (req) => {
    if(req.body._id){
      return Epilogues.replaceOne({_id: req.body._id}, req.body);
    }else{
      return new Epilogues(req.body).save();
    }
};

const deleteEpilogue = (req) => {
    return Epilogues.deleteOne({_id: req.params.id});
};

module.exports = {
    getEpilogue,
    upsertEpilogue,
    deleteEpilogue
};

