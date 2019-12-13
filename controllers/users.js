const UsersService = require('../services/users');

const getNickName = (req, res) => {
    UsersService.getNickName(req.params.email)
        .then(result => {
            console.log(result[0].nickName)
            res.json(result[0].nickName);
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
};

module.exports = { getNickName };
