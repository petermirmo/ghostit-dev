module.exports = {
  handleError: (res, err, object, message) => {
    if (object) {
      console.log(object);
    }
    let error = err;
    if (message) error = message;

    console.log("\n");
    console.log(err);
    console.log(message);
    console.log("\n");
    if (res) res.send({ success: false, message: error });
    return false;
  },

  indexChecks: index => {
    // don't want to overwrite these attributes of a DB object otherwise it invalidates them
    if (
      index === "_id" ||
      index === "__v" ||
      index === "createdAt" ||
      index === "updatedAt"
    ) {
      return false;
    }
    return true;
  }
};
