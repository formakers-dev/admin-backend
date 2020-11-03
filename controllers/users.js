const UsersService = require('../services/users');

const getUsers = (req, res) => {
    try{
        if(req.query.type && req.query.keyword){
            console.log('getUser');
            return UsersService.getUser(req, res);
        }else{
            console.log('get all Users');
            return UsersService.getAllUsers(req, res);
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
};

const getUsersByFilter = (req, res) => {
    const type = req.body.type;
    const keywords = req.body.keywords;

    if (type !=='email' && type !=='userId' && type !=='nickName') {
        return res.status(400).json({error: '잘못된 타입입니다.'});
    }

    UsersService.getUsers(type, keywords)
      .then(result => {
          if (!result) {
              res.sendStatus(204);
          }
          res.status(200).json(result);
      }).catch(err => {
          console.error(err);
          return res.status(500).json({error: err.message});
      });
};

const getAllUsers = (req, res) => {
    try{
        console.log('getAllUsers');
        return UsersService.getAllUsers(req, res);
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
};

module.exports = { getUsers, getUsersByFilter, getAllUsers };
