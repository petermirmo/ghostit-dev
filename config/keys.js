if (process.env.NODE_ENV === "production") {
	module.exports = require("./productionDevelopmentKeys");
} else {
	module.exports = require("./localDevelopmentKeys");
}
