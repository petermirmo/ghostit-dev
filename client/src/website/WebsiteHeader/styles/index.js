let { mobileAndTabletcheck } = require("../../../componentFunctions");

if (mobileAndTabletcheck()) {
  module.exports = require("./mobileStyle.css");
} else {
  module.exports = require("./style.css");
}
