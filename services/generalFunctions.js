module.exports = {
  handleError: (res, err, object) => {
    if (object) {
      console.log(object);
    }
    console.log(err);
    res.send({ success: false, message: err });
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
