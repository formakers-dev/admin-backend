const AdminService = require('../services/admin');

const getAssignees = (req, res) => {
    try{
        return AdminService.getAssignees(req, res);
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
};

const getProfile = (req, res) => {
    try{
        return AdminService.getProfile(req, res);
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
}

const updateProfile = (req, res) => {
    try{
        return AdminService.updateProfile(req, res);
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
}

module.exports = { getAssignees, getProfile, updateProfile };
