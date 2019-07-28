let { isMobileOrTablet } = require("../../../../componentFunctions");

if (isMobileOrTablet()) {
  module.exports = require("./mobileStyle.css");
} else {
  module.exports = require("./style.css");
}
