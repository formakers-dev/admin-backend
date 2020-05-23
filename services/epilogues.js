const mongoose = require('mongoose');
const Epilogues = require('../models/epilogues');

const getEpilogue = (betaTestId) => {
    return Epilogues.findOne({betaTestId: betaTestId}).lean();
};

const upsertEpilogue = (req) => {
    console.log(req.body);
    if(req.body._id){
        console.log('update');
      return Epilogues.replaceOne({_id: req.body._id}, req.body);
    }else{
        console.log('save');
      return new Epilogues(req.body).save();
    }
};

const updateEpilogue = (req) => {
    return Epilogues.replaceOne({_id: req.params.id}, req.body);
};

const deleteEpilogue = (req) => {
    return Epilogues.deleteOne({_id: req.params.id});
};

module.exports = {
    getEpilogue,
    upsertEpilogue,
    deleteEpilogue
};

