const getNotifications = (req, res) => {
  Notification.find({ userID: req.user._id }, (err, notifications) => {
    res.send(notifications);
  });
};
module.exports = {
  getNotifications
};
