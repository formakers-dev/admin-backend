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
            res.json(result)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

const updateBetaTest = (req, res) => {
    console.log('updateBetaTest');
    const betaTest = req.body;
    BetaTestService.updateBetaTest(betaTest)
        .then(result => {
            console.log(result);
            res.json(result)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

const getBetaTest = (req, res) => {
    BetaTestService.findBetaTest(req.params.id)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

const getFeedback = (req, res) => {
    BetaTestService.readFeedbackAggregations(req.params.betaTestId, req.params.missionId)
      .then(data => {
          res.json(data);
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({error: err.message});
      })
}

module.exports = {
    registerBetaTest,
    updateBetaTest,
    getAllBetaTests,
    getBetaTest,
    getFeedback
};
