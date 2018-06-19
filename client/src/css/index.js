let { mobileAndTabletcheck } = require("../extra/functions/CommonFunctions");

if (mobileAndTabletcheck()) {
	module.exports = require("./mobileTheme.css");
} else {
	module.exports = require("./theme.css");
}
