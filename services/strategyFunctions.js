const Strategy = require("../models/Strategy");
const generalFunctions = require("./generalFunctions");

module.exports = {
  saveStrategy: function(req, res) {
    let currentStrategy = req.body;
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Strategy.findOne({ userID }, function(err, strategy) {
      if (err) return generalFunctions.handleError(res, err);
      else {
        let newStrategy;
        if (strategy) {
          newStrategy = strategy;
        } else {
          newStrategy = new Strategy();
        }
        newStrategy.userID = userID;
        for (let index in currentStrategy) {
          if (Array.isArray(currentStrategy[index])) {
            let tempArray = [];
            for (let j in currentStrategy[index]) {
              tempArray.push(currentStrategy[index][j]);
            }
            newStrategy[index] = tempArray;
          } else {
            newStrategy[index] = currentStrategy[index];
          }
        }
        newStrategy.save().then(result => res.send(true));
      }
    });
  },
  getStrategy: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Strategy.findOne({ userID }, function(err, strategy) {
      if (err) generalFunctions.handleError(res, err);
      else if (strategy) {
        res.send({ success: true, strategy });
      } else {
        generalFunctions.handleError(res, "No strategy found!");
      }
    });
  }
};
