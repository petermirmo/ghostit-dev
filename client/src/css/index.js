let { mobileAndTabletcheck } = require("../extra/functions/CommonFunctions");

if (mobileAndTabletcheck()) {
  module.exports = require("./theme.css");
} else {
  module.exports = require("./theme.css");
}
