import { isMobileOrTablet } from "../../util";

if (isMobileOrTablet()) {
  module.exports = require("./MobileOrTabletVersion.js");
} else {
  module.exports = require("./RegularVersion.js");
}
