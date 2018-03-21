const Strategy = require("../models/Strategy");

module.exports = {
	saveStrategy: function(req, res) {
		var currentStrategy = req.body;
		Strategy.findOne({ userID: req.user._id }, function(err, strategy) {
			if (err) {
				console.log(err);
				res.send(err);
				return;
			}
			var newStrategy;
			if (strategy) {
				newStrategy = strategy;
			} else {
				newStrategy = new Strategy();
			}
			newStrategy.userID = req.user._id;
			for (var index in currentStrategy) {
				if (Array.isArray(currentStrategy[index])) {
					var tempArray = [];
					for (var j in currentStrategy[index]) {
						tempArray.push(currentStrategy[index][j]);
					}
					newStrategy[index] = tempArray;
				} else {
					newStrategy[index] = currentStrategy[index];
				}
			}
			newStrategy.save().then(result => res.send(true));
		});
	},
	getStrategy: function(req, res) {
		Strategy.findOne({ userID: req.user._id }, function(err, strategy) {
			if (err) {
				console.log(err);
				res.send(err);
				return;
			}
			if (strategy) {
				res.send(strategy);
			} else {
				res.send(false);
			}
		});
	}
};
