const BetaTestService = require('../services/betaTests');

const registerBetaTest = (req, res) => {
    console.log('registerBetaTest');
    const betaTest = req.body;

    BetaTestService.insertBetaTest(betaTest)
        .then(result => {
            console.log(result);
            res.json(result)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

const getAllBetaTests = (req, res) => {
    BetaTestService.findAllBetaTest()
        .then(result => {
            console.log(result);
            res.json(result)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

module.exports = {
    registerBetaTest,
    getAllBetaTests
};
