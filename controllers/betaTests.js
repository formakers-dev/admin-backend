const BetaTestService = require('../services/betaTests');

const registerBetaTest = (req, res) => {
    const betaTest = req.body;

    betaTest.missions = betaTest.missions.map(mission => {
        mission._id = BetaTestService.getNewObjectId();
        mission.item._id = BetaTestService.getNewObjectId();
        mission.items = [ mission.item ];
        delete mission.item;
        return mission;
    });

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
