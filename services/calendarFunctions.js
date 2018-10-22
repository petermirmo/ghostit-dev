const User = require("../models/User");
const Calendar = require("../models/Calendar");
const Blog = require("../models/Blog");
const Post = require("../models/Post");
const Newsletter = require("../models/Newsletter");
const Campaign = require("../models/Campaign");

mongoIdArrayIncludes = (array, id) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].str === id.str) {
      return true;
    }
  }
  return false;
};

module.exports = {
  getCalendars: function(req, res) {
    // get all calendars that the user is subscribed to
    // res.send({ success: true, calendars, defaultCalendarID });
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Calendar.find({ userIDs: userID }, (err, foundCalendars) => {
      if (err || !foundCalendars) {
        res.send({
          success: false,
          err,
          message: `error occurred when trying to fetch calendars associated with user id ${userID}`
        });
      } else {
        if (foundCalendars.length === 0) {
          // this user doesnt have a calendar yet so we need to make them one
          const newCalendar = new Calendar();
          newCalendar.adminID = userID;
          newCalendar.userIDs = [userID];
          newCalendar.personalCalendar = true;
          newCalendar.calendarName = "Personal Calendar";
          // need to set the user's defaultCalendarID
          User.findOne({ _id: userID }, (err, foundUser) => {
            if (err || !foundUser) {
              res.send({
                success: false,
                err,
                message: `error occurred when trying to fetch user with id ${userID} in an attempt to save its first calendar.`
              });
            } else {
              foundUser.defaultCalendarID = newCalendar._id;
              foundUser.save();
              newCalendar.save();
              res.send({
                success: true,
                calendars: [newCalendar],
                defaultCalendarID: newCalendar._id
              });
            }
          });
        } else {
          User.findOne({ _id: userID }, (err, foundUser) => {
            if (err || !foundUser) {
              res.send({
                success: false,
                err,
                message: `error occurred when trying to fetch user with id ${userID} in an attempt to get its defaultCalendarID`
              });
            } else {
              res.send({
                success: true,
                calendars: foundCalendars,
                defaultCalendarID: foundUser.defaultCalendarID
              });
            }
          });
        }
      }
    });
  },
  getPosts: function(req, res) {
    // Get all posts for user
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Calendar.findOne({ _id: req.params.calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: `Error occurred when attempting to fetch calendar with id ${
            req.params.calendarID
          }`
        });
      } else {
        if (!mongoIdArrayIncludes(foundCalendar.userIDs, userID)) {
          res.send({
            success: false,
            message: `Calendar with id ${
              req.params.calendarID
            } does not have user id ${userID} as one of its authorized users.`
          });
        } else {
          // calendar is found and associated with correct userID
          // now we fetch all the posts associated with that calendar
          // if the calendar is their Personal calendar, we also fetch all posts with
          // calendarID: undefined, and userID: userID
          // this allows older posts that don't have a calendarID to be associated with their personal calendar
          Post.find(
            { calendarID: req.params.calendarID },
            (err, foundPosts) => {
              if (err || !foundPosts) {
                res.send({
                  success: false,
                  err,
                  message: `Calendar with id ${
                    req.params.calendarID
                  } found and user with id ${userID} is subscribed to it. However, an error occurred when fetching all posts associated with the calendar.`
                });
              } else {
                // foundPosts is all posts associated with the calendar
                if (foundCalendar.personalCalendar) {
                  // this calendar is the user's personal calendar so we need to also fetch all posts
                  // with userID: userID and calendarID: undefined
                  Post.find(
                    { userID: userID, calendarID: undefined },
                    (err, foundUserPosts) => {
                      if (err || !foundUserPosts) {
                        res.send({
                          success: false,
                          err,
                          message: `Error occurred when trying to fetch all posts with user id ${userID} and calendarID: undefined.`
                        });
                      } else {
                        res.send({
                          success: true,
                          posts: [...foundPosts, ...foundUserPosts]
                        });
                      }
                    }
                  );
                } else {
                  res.send({
                    success: true,
                    posts: foundPosts
                  });
                }
              }
            }
          );
        }
      }
    });
  },
  getBlogs: function(req, res) {
    // Get all blogs for user
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Calendar.findOne({ _id: req.params.calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: `Error occurred when attempting to fetch calendar with id ${
            req.params.calendarID
          }`
        });
      } else {
        if (!mongoIdArrayIncludes(foundCalendar.userIDs, userID)) {
          res.send({
            success: false,
            message: `Calendar with id ${
              req.params.calendarID
            } does not have user id ${userID} as one of its authorized users.`
          });
        } else {
          Blog.find(
            { calendarID: req.params.calendarID },
            (err, foundBlogs) => {
              if (err || !foundBlogs) {
                res.send({
                  success: false,
                  err,
                  message: `Calendar with id ${
                    req.params.calendarID
                  } found and user with id ${userID} is subscribed to it. However, an error occurred when fetching all blogs associated with the calendar.`
                });
              } else {
                // foundBlogs is all blogs associated with the calendar
                if (foundCalendar.personalCalendar) {
                  // this calendar is the user's personal calendar so we need to also fetch all blogs
                  // with userID: userID and calendarID: undefined
                  Blog.find(
                    { userID: userID, calendarID: undefined },
                    (err, foundUserBlogs) => {
                      if (err || !foundUserBlogs) {
                        res.send({
                          success: false,
                          err,
                          message: `Error occurred when trying to fetch all blogs with user id ${userID} and calendarID: undefined.`
                        });
                      } else {
                        res.send({
                          success: true,
                          blogs: [...foundBlogs, ...foundUserBlogs]
                        });
                      }
                    }
                  );
                } else {
                  res.send({
                    success: true,
                    blogs: foundBlogs
                  });
                }
              }
            }
          );
        }
      }
    });
  },
  getNewsletters: function(req, res) {
    // Get all newsletters for user
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Calendar.findOne({ _id: req.params.calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: `Error occurred when attempting to fetch calendar with id ${
            req.params.calendarID
          }`
        });
      } else {
        if (!mongoIdArrayIncludes(foundCalendar.userIDs, userID)) {
          res.send({
            success: false,
            message: `Calendar with id ${
              req.params.calendarID
            } does not have user id ${userID} as one of its authorized users.`
          });
        } else {
          Newsletter.find(
            { calendarID: req.params.calendarID },
            (err, foundNewsletters) => {
              if (err || !foundNewsletters) {
                res.send({
                  success: false,
                  err,
                  message: `Calendar with id ${
                    req.params.calendarID
                  } found and user with id ${userID} is subscribed to it. However, an error occurred when fetching all newsletters associated with the calendar.`
                });
              } else {
                // foundNewsletters is all newsletters associated with the calendar
                if (foundCalendar.personalCalendar) {
                  // this calendar is the user's personal calendar so we need to also fetch all newsletters
                  // with userID: userID and calendarID: undefined
                  Newsletter.find(
                    { userID: userID, calendarID: undefined },
                    (err, foundUserNewsletters) => {
                      if (err || !foundUserNewsletters) {
                        res.send({
                          success: false,
                          err,
                          message: `Error occurred when trying to fetch all newsletters with user id ${userID} and calendarID: undefined.`
                        });
                      } else {
                        res.send({
                          success: true,
                          newsletters: [
                            ...foundNewsletters,
                            ...foundUserNewsletters
                          ]
                        });
                      }
                    }
                  );
                } else {
                  res.send({
                    success: true,
                    newsletters: foundNewsletters
                  });
                }
              }
            }
          );
        }
      }
    });
  },
  getCampaigns: function(req, res) {
    // Get all campaigns for user
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Calendar.findOne({ _id: req.params.calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: `Error occurred when attempting to fetch calendar with id ${
            req.params.calendarID
          }`
        });
      } else {
        if (!mongoIdArrayIncludes(foundCalendar.userIDs, userID)) {
          res.send({
            success: false,
            message: `Calendar with id ${
              req.params.calendarID
            } does not have user id ${userID} as one of its authorized users.`
          });
        } else {
          Campaign.find(
            { calendarID: req.params.calendarID },
            (err, foundCampaigns) => {
              if (err || !foundCampaigns) {
                res.send({
                  success: false,
                  err,
                  message: `Calendar with id ${
                    req.params.calendarID
                  } found and user with id ${userID} is subscribed to it. However, an error occurred when fetching all campaigns associated with the calendar.`
                });
              } else {
                // foundCampaigns is all campaigns associated with the calendar
                if (foundCalendar.personalCalendar) {
                  // this calendar is the user's personal calendar so we need to also fetch all campaigns
                  // with userID: userID and calendarID: undefined
                  Campaign.find(
                    { userID: userID, calendarID: undefined },
                    (err, foundUserCampaigns) => {
                      if (err || !foundUserCampaigns) {
                        res.send({
                          success: false,
                          err,
                          message: `Error occurred when trying to fetch all campaigns with user id ${userID} and calendarID: undefined.`
                        });
                      } else {
                        res.send({
                          success: true,
                          campaigns: [...foundCampaigns, ...foundUserCampaigns]
                        });
                      }
                    }
                  );
                } else {
                  res.send({
                    success: true,
                    campaigns: foundCampaigns
                  });
                }
              }
            }
          );
        }
      }
    });
  }
};
