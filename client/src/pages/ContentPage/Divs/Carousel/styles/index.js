let { mobileAndTabletcheck } = require("../../../../../extra/functions/CommonFunctions");

if (mobileAndTabletcheck()) {
	module.exports = require("./mobileStyle.css");
} else {
	module.exports = require("./style.css");
}
