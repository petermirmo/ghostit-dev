import { isMobileOrTablet } from "../../../../util";

if (isMobileOrTablet()) {
  module.exports = require("./mobileStyle.css");
} else {
  module.exports = require("./style.css");
}
