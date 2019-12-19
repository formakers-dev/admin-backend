const UsersService = require('../services/users');

const getNickName = (req, res) => {
    UsersService.getNickName(req.params.email)
        .then(results => {
            if (results.length > 0) {
                res.json({
                    email: req.params.email,
                    nickName: results[0].nickName,
                });
            } else {
                res.sendStatus(204);
            }
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
};

module.exports = { getNickName };
