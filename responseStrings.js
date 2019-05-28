const errorConnectingToDatabase =
  "There was an error connecting to database, please try again later.";

const noObjectFound = objectName =>
  `You do not have the ${objectName} to do this action.`;

const userNotPermitted = "You are not permitted to do this action.";

module.exports = {
  errorConnectingToDatabase,
  userNotPermitted
};
