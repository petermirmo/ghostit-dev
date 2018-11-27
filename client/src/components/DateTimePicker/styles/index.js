let {
  mobileAndTabletcheck
} = require("../../../extra/functions/CommonFunctions");

if (mobileAndTabletcheck()) {
  module.exports = require("./style.css"); // Maybe will be MobileStyle.css in the future
} else {
  module.exports = require("./style.css");
}
