let {
  mobileAndTabletcheck
} = require("../../../extra/functions/CommonFunctions");

if (mobileAndTabletcheck()) {
  module.exports = require("./style.css");
} else {
  module.exports = require("./style.css");
}
