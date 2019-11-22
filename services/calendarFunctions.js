const User = require("../models/User");
const Account = require("../models/Account");
const Calendar = require("../models/Calendar");
const Blog = require("../models/Blog");
const Post = require("../models/Post");
const Newsletter = require("../models/Newsletter");
const Campaign = require("../models/Campaign");

const generalFunctions = require("./generalFunctions");
const postFunctions = require("./postFunctions");
const campaignFunctions = require("./campaignFunctions");

const moment = require("moment-timezone");

const demoCalendarMaximumPosts = 10;
// number of elements in chatHistory that we want to fetch when retrieving calendar objects in DB
// (number must be negative to signify you want the last elements in the array)
const chatHistoryMessagesToLoadAtFirst = -20;

getAllAccounts = (req, res) => {
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
      const allAccountIDs = [];

      for (let index in foundCalendars) {
        const calendar = foundCalendars[index];
        calendar.accountIDs.sort();
        if (calendar.accountIDs)
          for (let i = calendar.accountIDs.length - 1; i >= 0; i--) {
            if (
              String(calendar.accountIDs[i]) ===
              String(calendar.accountIDs[i - 1])
            )
              calendar.accountIDs.splice(i, 1);
            else allAccountIDs.push({ _id: calendar.accountIDs[i] });
          }
      }

      Account.find(
        {
          $and: [
            { $or: allAccountIDs },
            {
              $or: [{ socialType: "facebook" }, { socialType: "instagram" }]
            }
          ],
          accountType: "page"
        },
        (err, accounts) => {
          res.send({ success: true, allAccounts: accounts });
        }
      );
    }
  });
};

mongoIdArrayIncludes = (array, id) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].toString() === id.toString()) {
      return true;
    }
  }
  return false;
};

fillCampaignPosts = async (res, campaigns) => {
  let campaignArray = [];

  if (campaigns.length != 0) {
    for (let index in campaigns) {
      let campaign = campaigns[index];
      await Post.find({ _id: { $in: campaign.posts } }, (err, posts) => {
        if (err) generalFunctions.handleError(res, err);
        else {
          campaignArray.push({ campaign, posts });
          if (index == campaigns.length - 1) {
            return res.send({
              success: true,
              campaigns: campaignArray
            });
          }
        }
      });
    }
  } else {
    return res.send({
      success: true,
      campaigns: []
    });
  }
};

module.exports = {
  getAllAccounts,
  getCalendars: (req, res) => {
    // get all calendars that the user is subscribed to
    // res.send({ success: true, calendars, defaultCalendarID });
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Calendar.find(
      { userIDs: userID },
      { chatHistory: { $slice: chatHistoryMessagesToLoadAtFirst } },
      (err, foundCalendars) => {
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
            newCalendar.calendarName = "Calendar 1";
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
                if (foundUser.role === "demo") {
                  newCalendar.postsLeft = demoCalendarMaximumPosts;
                } else {
                  newCalendar.postsLeft = -1;
                }
                if (req.user) {
                  if (foundUser.timezone)
                    newCalendar.timezone = foundUser.timezone;
                  else newCalendar.timezone = "America/Vancouver";
                } else newCalendar.timezone = "America/Vancouver";

                newCalendar.save();

                Post.find(
                  { userID, calendarID: undefined },
                  (err, foundPosts) => {
                    if (err || !foundPosts) {
                      console.log(
                        `Error while trying to fetch all old posts to link to new calendar.`
                      );
                    } else {
                      for (let i = 0; i < foundPosts.length; i++) {
                        const post = foundPosts[i];
                        post.calendarID = newCalendar._id;
                        post.save();
                      }
                    }
                  }
                );
                Campaign.find(
                  { userID, calendarID: undefined },
                  (err, foundCampaigns) => {
                    if (err || !foundCampaigns) {
                      console.log(
                        `Error while trying to fetch all old campaigns to link to new calendar.`
                      );
                    } else {
                      for (let i = 0; i < foundCampaigns.length; i++) {
                        const campaign = foundCampaigns[i];
                        campaign.calendarID = newCalendar._id;
                        campaign.save();
                      }
                    }
                  }
                );

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
                for (let i = 0; i < foundCalendars.length; i++) {
                  // make sure all calendars (that this user is the admin of) are appropriately locked/unlocked based on the user's role
                  if (
                    foundCalendars[i].adminID.toString() ===
                    foundUser._id.toString()
                  ) {
                    if (foundUser.role === "demo") {
                      if (foundCalendars[i].postsLeft === -1) {
                        // user is demo, but their calendar is unlocked so we need to change this calendar to be locked
                        foundCalendars[i].postsLeft = 0;
                        foundCalendars[i].save();
                      }
                    } else {
                      if (foundCalendars[i].postsLeft !== -1) {
                        // user is paid, but their calendar is locked so we need to change this calendar to be unlocked
                        foundCalendars[i].postsLeft = -1;
                        foundCalendars[i].save();
                      }
                    }
                  }
                }
                const defaultCalendarIndex = foundCalendars.findIndex(
                  calObj => {
                    return (
                      calObj._id.toString() ===
                      foundUser.defaultCalendarID.toString()
                    );
                  }
                );
                if (defaultCalendarIndex !== -1) {
                  res.send({
                    success: true,
                    calendars: foundCalendars,
                    defaultCalendarID: foundUser.defaultCalendarID
                  });
                } else {
                  // user's defaultCalendarID no longer exists so we need to update it
                  foundUser.defaultCalendarID = foundCalendars[0]._id;
                  foundUser.save();
                  res.send({
                    success: true,
                    calendars: foundCalendars,
                    defaultCalendarID: foundUser.defaultCalendarID
                  });
                }
              }
            });
          }
        }
      }
    );
  },
  getPosts: (req, res) => {
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
          message: `Error occurred when attempting to fetch calendar with id ${req.params.calendarID}`
        });
      } else {
        if (!mongoIdArrayIncludes(foundCalendar.userIDs, userID)) {
          res.send({
            success: false,
            message: `Calendar with id ${req.params.calendarID} does not have user id ${userID} as one of its authorized users.`
          });
        } else {
          // calendar is found and associated with correct userID
          // now we fetch all the posts associated with that calendar

          let calendarDate = new moment(req.body.calendarDate);

          let firstDayOfMonth = calendarDate.day();
          let weekStartMonth = firstDayOfMonth === 0 ? -1 : 0;
          let weekEndMonth =
            firstDayOfMonth + calendarDate.daysInMonth() > 35 &&
            weekStartMonth !== -1
              ? 42
              : 35;

          // Get calendar starting date
          let calendarStartDate = new moment(calendarDate)
            .subtract(firstDayOfMonth, "days")
            .add(firstDayOfMonth === 0 ? -7 : 0, "days");
          // Get calendar ending date
          let calendarEndDate = new moment(calendarDate)
            .subtract(firstDayOfMonth, "days")
            .add(weekEndMonth, "days");

          calendarStartDate.set("hour", 0);
          calendarStartDate.set("minute", 0);

          calendarEndDate.set("hour", 23);
          calendarEndDate.set("minute", 59);

          Post.find(
            {
              calendarID: req.params.calendarID,
              campaignID: undefined,
              $and: [
                { postingDate: { $lt: calendarEndDate } },
                {
                  postingDate: { $gt: calendarStartDate }
                }
              ]
            },
            (err, foundPosts) => {
              if (err || !foundPosts) {
                res.send({
                  success: false,
                  err,
                  message: `Calendar with id ${req.params.calendarID} found and user with id ${userID} is subscribed to it. However, an error occurred when fetching all posts associated with the calendar.`
                });
              } else {
                res.send({
                  success: true,
                  posts: foundPosts
                });
              }
            }
          );
        }
      }
    });
  },
  getBlogs: (req, res) => {
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
          message: `Error occurred when attempting to fetch calendar with id ${req.params.calendarID}`
        });
      } else {
        if (!mongoIdArrayIncludes(foundCalendar.userIDs, userID)) {
          res.send({
            success: false,
            message: `Calendar with id ${req.params.calendarID} does not have user id ${userID} as one of its authorized users.`
          });
        }
      }
    });
  },
  getCampaigns: (req, res) => {
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
          message: `Error occurred when attempting to fetch calendar with id ${req.params.calendarID}`
        });
      } else {
        if (!mongoIdArrayIncludes(foundCalendar.userIDs, userID)) {
          res.send({
            success: false,
            message: `Calendar with id ${req.params.calendarID} does not have user id ${userID} as one of its authorized users.`
          });
        } else {
          Campaign.find(
            { calendarID: req.params.calendarID },
            (err, foundCampaigns) => {
              if (err || !foundCampaigns) {
                res.send({
                  success: false,
                  err,
                  message: `Calendar with id ${req.params.calendarID} found and user with id ${userID} is subscribed to it. However, an error occurred when fetching all campaigns associated with the calendar.`
                });
              } else {
                // foundCampaigns is all campaigns associated with the calendar
                fillCampaignPosts(res, foundCampaigns);
              }
            }
          );
        }
      }
    });
  },
  createNewCalendar: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    User.findOne({ _id: userID }, (err, foundUser) => {
      if (err || !foundUser) {
        res.send({
          success: false,
          err,
          message: "Error while looking up user in database."
        });
      } else {
        if (foundUser.role === "demo") {
          res.send({
            success: false,
            message:
              "Demo users do not have the ability to create new calendars."
          });
        } else {
          const newCalendar = new Calendar();
          newCalendar.calendarName = req.body.name;
          newCalendar.adminID = userID;
          newCalendar.userIDs = [userID];
          newCalendar.postsLeft = -1;
          if (foundUser) {
            if (foundUser.timezone) newCalendar.timezone = foundUser.timezone;
            else newCalendar.timezone = "America/Vancouver";
          } else newCalendar.timezone = "America/Vancouver";

          newCalendar.save().then(() => {
            res.send({ success: true, newCalendar });
          });
        }
      }
    });
  },
  getUsers: (req, res) => {
    // return a list of the users (including their names and emails) associated with a calendar
    // this function is used for the Manage Calendar modal to display the users of a calendar
    const id = req.params.calendarID;

    Calendar.findOne({ _id: id }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: `Unable to find calendar with id ${id}.`
        });
      } else {
        // find all users that are in the calendar's userIDs array
        // make an array to be used with the mongodb $or operator
        const userIDList = foundCalendar.userIDs.map(userID => {
          return { _id: userID };
        });
        User.find(
          { $or: userIDList },
          "fullName email signedInAsUser",
          (err, foundUsers) => {
            if (err || !foundUsers) {
              res.send({
                success: false,
                err,
                message: `Unable to find users subscribed to calendar with id ${id}`
              });
            } else {
              res.send({
                success: true,
                users: foundUsers
              });
            }
          }
        );
      }
    });
  },
  inviteUser: (req, res) => {
    const { email, calendarID } = req.body;
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: `Unable to find calendar with id ${calendarID}`
        });
      } else {
        if (!mongoIdArrayIncludes(foundCalendar.userIDs, userID)) {
          res.send({
            success: false,
            message: `User attempting to send invitation is not a valid member of the calendar. userID: ${userID}, calendarID: ${calendarID}.`
          });
        } else {
          if (foundCalendar.emailsInvited.includes(email)) {
            res.send({
              success: false,
              message: `${email} has already been invited to this calendar.`
            });
          } else {
            User.findOne({ email }, (err, foundUser) => {
              if (err) {
                res.send({
                  success: false,
                  err,
                  message: `Error while looking for user with email ${email}. Try again.`
                });
              } else {
                if (
                  foundUser &&
                  mongoIdArrayIncludes(foundCalendar.userIDs, foundUser._id)
                ) {
                  res.send({
                    success: false,
                    message: `User with email ${email} is already a member of this calendar.`
                  });
                } else {
                  foundCalendar.emailsInvited.push(email);
                  foundCalendar.save();
                  res.send({
                    success: true,
                    emailsInvited: foundCalendar.emailsInvited
                  });
                }
              }
            });
          }
        }
      }
    });
  },
  getCalendarInvites: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    User.findOne({ _id: userID }, (err, foundUser) => {
      if (err || !foundUser) {
        res.send({
          success: false,
          err,
          message: `Error while searching for user with ID ${userID}.`
        });
      } else {
        const email = foundUser.email;

        Calendar.find({ emailsInvited: email }, (err, foundCalendars) => {
          if (err || !foundCalendars) {
            res.send({
              success: false,
              err,
              message: `Error while searching for calendars with ${email} invited.`
            });
          } else {
            res.send({ success: true, calendars: foundCalendars });
          }
        });
      }
    });
  },
  calendarInviteResponse: (req, res) => {
    const { calendarID, response } = req.body;
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    User.findOne({ _id: userID }, (err, foundUser) => {
      if (err || !foundUser) {
        res.send({
          success: false,
          err,
          message: `Error while searching for user with ID ${userID}.`
        });
      } else {
        const email = foundUser.email;

        Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
          if (err || !foundCalendar) {
            res.send({
              success: false,
              err,
              message: `Error while searching for calendar with ID ${calendarID}.`
            });
          } else {
            const inviteIndex = foundCalendar.emailsInvited.indexOf(email);
            if (inviteIndex === -1) {
              res.send({
                success: false,
                message: `Calendar with id ${calendarID} does not have ${email} in its list of invited emails.`
              });
            } else {
              foundCalendar.emailsInvited.splice(inviteIndex, 1); // remove the email from the invited list
              if (response === true) {
                foundCalendar.userIDs.push(foundUser._id); // response is true so add userID to the calendar's userID list
              }
              foundCalendar.save();
              res.send({ success: true, calendar: foundCalendar });
            }
          }
        });
      }
    });
  },
  renameCalendar: (req, res) => {
    const { calendarID, name } = req.body;

    if (!name || name.length < 1) {
      res.send({ success: false, message: "Calendar names cannot be empty." });
    } else {
      Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
        if (err || !foundCalendar) {
          res.send({
            success: false,
            err,
            message: `Error while fetching calendar with id ${calendarID}.`
          });
        } else {
          foundCalendar.calendarName = name;
          foundCalendar.save();
          res.send({ success: true, calendar: foundCalendar });
        }
      });
    }
  },
  removeUserFromCalendar: (req, res) => {
    const { userID, calendarID } = req.body;
    let thisUserID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        thisUserID = req.user.signedInAsUser.id;
      }
    }

    Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: `Failed to find user with id ${userID} in the database. Try again or reload your page.`
        });
      } else {
        if (foundCalendar.adminID.toString() !== thisUserID.toString()) {
          res.send({
            success: false,
            message: `Only admins can remove users from a calendar. Reload your page if you are the admin of this calendar.`
          });
        } else {
          const userIndex = foundCalendar.userIDs.indexOf(userID);
          if (userIndex === -1) {
            res.send({
              success: false,
              message: `Unable to find user in this calendar's user list. Try reloading your page.`
            });
          } else {
            foundCalendar.userIDs.splice(userIndex, 1);
            foundCalendar.save();
            res.send({ success: true });
          }
        }
      }
    });
  },
  leaveCalendar: (req, res) => {
    // function for when a user wants to leave a calendar
    // calendar admins cannot leave, they must delete the calendar or pass admin to a different user then leave
    // if this is the user's default calendar, we won't update their default calendar id
    // the next time they load their calendars, the backend will detect they dont have a valid
    // defaultCalendarID and update it for them
    const { calendarID } = req.body;
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
          message: `Error while looking up all calendars associated with this user. Reload page and try again.`
        });
      } else {
        Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
          if (err || !foundCalendar) {
            res.send({
              success: false,
              err,
              message: `Error while fetching calendar with id ${calendarID}. Reload page and try again.`
            });
          } else {
            if (foundCalendar.adminID.toString() === userID.toString()) {
              res.send({
                success: false,
                message: `Calendar admins must delete the calendar rather than leave it. If you are not the admin, try reloading the page.`
              });
            } else {
              // calendar is eligible to be left
              const userIndex = foundCalendar.userIDs.findIndex(
                userid => userid.toString() === userID.toString()
              );
              if (userIndex === -1) {
                res.send({
                  sucecss: false,
                  message: `Failed to find user in the calendar's user list. Reload page and try again.`
                });
              } else {
                foundCalendar.userIDs.splice(userIndex, 1);
                foundCalendar.save();
                if (foundCalendars.length === 1) {
                  // user is leaving their only calendar so we need to make them a new one
                  const newCalendar = new Calendar();
                  newCalendar.adminID = userID;
                  newCalendar.userIDs = [userID];
                  newCalendar.calendarName = "First Calendar";
                  newCalendar.timezone = req.user.timezone;
                  if (req.user) {
                    if (req.user.timezone)
                      newCalendar.timezone = req.user.timezone;
                    else newCalendar.timezone = "America/Vancouver";
                  } else newCalendar.timezone = "America/Vancouver";

                  newCalendar.save();
                  res.send({
                    success: true,
                    newCalendar,
                    message: `Successfully left your only calendar. New calendar created automatically.`
                  });
                } else {
                  res.send({
                    success: true,
                    message: `Successfully left calendar.`
                  });
                }
              }
            }
          }
        });
      }
    });
  },
  deleteCalendar: (req, res) => {
    const { calendarID } = req.body;
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    User.findOne({ _id: userID }, (err, foundUser) => {
      if (err || !foundUser) {
        res.send({
          success: false,
          err,
          message: "Error while looking up user in database."
        });
      } else {
        if (foundUser.role === "demo") {
          res.send({
            success: false,
            message:
              "Demo users do not have the ability to create or delete calendars."
          });
        } else {
          Calendar.find({ userIDs: userID }, (err, foundCalendars) => {
            // find all the user's calendars so that later on, if we delete the calendar
            // and it turns out to be the user's last calendar, we can make them a new one.
            if (err || !foundCalendars) {
              res.send({
                success: false,
                err,
                message: `Error while looking up all calendars associated with this user. Reload page and try again.`
              });
            } else {
              Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
                if (err || !foundCalendar) {
                  res.send({
                    success: false,
                    err,
                    message: `Error while fetching calendar with id ${calendarID}. Reload page and try again.`
                  });
                } else {
                  if (foundCalendar.adminID.toString() !== userID.toString()) {
                    res.send({
                      success: false,
                      message: `Only calendar admins are allowed to delete their calendar. If you are the admin, try reloading the page.`
                    });
                  } else if (foundCalendar.userIDs.length > 1) {
                    res.send({
                      success: false,
                      message: `Calendars can only be deleted when they have only 1 user left in them. Remove all users then try deleting.`
                    });
                  } else {
                    // calendar is eligible to be deleted
                    // so now we must delete all the posts / campaigns / blogs / newsletters
                    Post.find({ calendarID }, (err, foundPosts) => {
                      if (err || !foundPosts) {
                        res.send({
                          success: false,
                          message: `Error while fetching all calendar posts to be deleted.`
                        });
                      } else {
                        Campaign.find({ calendarID }, (err, foundCampaigns) => {
                          if (err || !foundCampaigns) {
                            res.send({
                              success: false,
                              message: `Error while fetching all calendar campaigns to be deleted.`
                            });
                          } else {
                            // foundPosts, foundCampaigns, now all need to be deleted
                            let deletedCount = {
                              totalDeleted: 0,
                              totalFailed: 0,
                              postFailed: 0,
                              campaignFailed: 0,
                              blogFailed: 0,
                              newsletterFailed: 0,
                              totalTarget:
                                foundPosts.length + foundCampaigns.length
                            };
                            if (deletedCount.totalTarget === 0) {
                              // nothing to delete in the calendar so just delete it
                              foundCalendar.remove();
                              if (foundCalendars.length === 1) {
                                const newCalendar = new Calendar();
                                newCalendar.calendarName = "First Calendar";
                                newCalendar.adminID = userID;
                                newCalendar.userIDs = [userID];
                                if (req.user) {
                                  if (foundUser.timezone)
                                    newCalendar.timezone = foundUser.timezone;
                                  else
                                    newCalendar.timezone = "America/Vancouver";
                                } else
                                  newCalendar.timezone = "America/Vancouver";
                                newCalendar.save();
                                res.send({
                                  success: true,
                                  newCalendar
                                });
                              } else {
                                res.send({ success: true });
                              }
                            } else {
                              const deleteCallback = (
                                result,
                                type,
                                countObj
                              ) => {
                                if (result.success) {
                                  countObj.totalDeleted++;
                                } else {
                                  countObj.totalFailed++;
                                  switch (type) {
                                    case "post":
                                      countObj.postFailed++;
                                      break;
                                    case "campaign":
                                      countObj.campaignFailed++;
                                      break;
                                    case "blog":
                                      countObj.blogFailed++;
                                      break;
                                    case "newsletter":
                                      countObj.newsletterFailed++;
                                      break;
                                  }
                                }
                                if (
                                  countObj.totalDeleted +
                                    countObj.totalFailed ===
                                  countObj.totalTarget
                                ) {
                                  // this is the final thing to delete so now we res.send()
                                  if (countObj.totalFailed === 0) {
                                    foundCalendar.remove();
                                    if (foundCalendars.length === 1) {
                                      const newCalendar = new Calendar();
                                      newCalendar.calendarName =
                                        "First Calendar";
                                      newCalendar.adminID = userID;
                                      newCalendar.userIDs = [userID];
                                      if (req.user) {
                                        if (foundUser.timezone)
                                          newCalendar.timezone =
                                            foundUser.timezone;
                                        else
                                          newCalendar.timezone =
                                            "America/Vancouver";
                                      } else
                                        newCalendar.timezone =
                                          "America/Vancouver";
                                      newCalendar.save();
                                      res.send({
                                        success: true,
                                        newCalendar
                                      });
                                    } else {
                                      res.send({ success: true });
                                    }
                                  } else {
                                    // not everything was deleted so we cant delete the calendar
                                    res.send({
                                      success: false,
                                      message: `Failed to delete ${failedPostCount} posts, ${failedCampaignCount} campaigns, ${failedBlogCount} blogs, and ${failedNewsletterCount} newsletters. Calendar not deleted.`
                                    });
                                  }
                                }
                              };
                              // stuff to delete in calendar
                              for (let i = 0; i < foundPosts.length; i++) {
                                postFunctions.deletePostStandalone(
                                  {
                                    postID: foundPosts[i]._id,
                                    user: req.user,
                                    skipUserCheck: true
                                  },
                                  result => {
                                    deleteCallback(
                                      result,
                                      "post",
                                      deletedCount
                                    );
                                  }
                                );
                              }
                              for (let i = 0; i < foundCampaigns.length; i++) {
                                campaignFunctions.deleteCampaignStandalone(
                                  {
                                    campaignID: foundCampaigns[i]._id,
                                    user: req.user,
                                    skipUserCheck: true
                                  },
                                  result => {
                                    deleteCallback(
                                      result,
                                      "campaign",
                                      deletedCount
                                    );
                                  }
                                );
                              }
                            }
                          }
                        });
                      }
                    });
                  }
                }
              });
            }
          });
        }
      }
    });
  },
  setDefaultCalendar: (req, res) => {
    const { calendarID } = req.body;
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    User.findOne({ _id: userID }, (err, foundUser) => {
      if (err || !foundUser) {
        res.send({
          success: false,
          err,
          message: `Error while fetching user from database. Reload page and try again.`
        });
      } else {
        Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
          if (err || !foundCalendar) {
            res.send({
              success: false,
              err,
              message: `Error while fetching calendar from database. Reload page and try again.`
            });
          } else {
            if (!mongoIdArrayIncludes(foundCalendar.userIDs, userID)) {
              res.send({
                success: false,
                message: `User was not found to be a member of this calendar.`
              });
            } else {
              foundUser.defaultCalendarID = calendarID;
              foundUser.save();
              res.send({
                success: true,
                message: `Successfully modified default calendar.`
              });
            }
          }
        });
      }
    });
  },
  getSocialAccounts: (req, res) => {
    const calendarID = req.params.calendarID;
    Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: `Error while looking up calendar to get social accounts`
        });
      } else {
        if (
          !foundCalendar.accountIDs ||
          foundCalendar.accountIDs.length === 0
        ) {
          res.send({ success: true, accounts: [] });
        } else {
          const accountIDList = foundCalendar.accountIDs.map(actID => {
            return {
              _id: actID
            };
          });
          Account.find({ $or: accountIDList }, (err, foundAccounts) => {
            if (err || !foundAccounts) {
              res.send({
                success: false,
                err,
                message: `Error while fetching all social accounts linked to the calendar.`
              });
            } else {
              res.send({ success: true, accounts: foundAccounts });
            }
          });
        }
      }
    });
  },
  getSocialAccountsExtra: (req, res) => {
    // this function is the same as getSocialAccounts() except that this one will
    // also return user info of the account's 'creator'
    // (this is so we can display who linked the account to the calendar)
    const calendarID = req.params.calendarID;
    Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: `Error while looking up calendar to get social accounts`
        });
      } else {
        if (
          !foundCalendar.accountIDs ||
          foundCalendar.accountIDs.length === 0
        ) {
          res.send({ success: true, accounts: [] });
        } else {
          const accountIDList = foundCalendar.accountIDs.map(actID => {
            return {
              _id: actID
            };
          });
          Account.find({ $or: accountIDList }, (err, foundAccounts) => {
            if (err || !foundAccounts) {
              res.send({
                success: false,
                err,
                message: `Error while fetching all social accounts linked to the calendar.`
              });
            } else {
              // look up each foundAccounts[i].userID and attach the user's info to the account objects
              // then return all the account objects
              const userIDList = foundAccounts.map(actObj => {
                return {
                  _id: actObj.userID
                };
              });
              User.find(
                { $or: userIDList },
                "fullName email",
                (err, foundUsers) => {
                  if (err || !foundUsers) {
                    res.send({
                      success: false,
                      err,
                      message: `Error while looking up user info for all social accounts.`
                    });
                  } else {
                    const extraAccounts = [];
                    for (let i = 0; i < foundAccounts.length; i++) {
                      const account = foundAccounts[i];
                      const userIndex = foundUsers.findIndex(userObj => {
                        return (
                          userObj._id.toString() === account.userID.toString()
                        );
                      });
                      if (userIndex === -1) {
                        extraAccounts.push({
                          ...account._doc,
                          user: { name: "Unknown", email: "Unknown" }
                        });
                        continue;
                      }
                      const user = foundUsers[userIndex];
                      extraAccounts.push({
                        ...account._doc,
                        user: { name: user.fullName, email: user.email }
                      });
                    }
                    res.send({ success: true, accounts: extraAccounts });
                  }
                }
              );
            }
          });
        }
      }
    });
  },
  linkSocialAccount: (req, res) => {
    const { calendarID, accountID } = req.body;
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Account.findOne({ _id: accountID }, (err, foundAccount) => {
      // first, make sure the account actually belongs to the user
      if (err || !foundAccount) {
        res.send({
          success: false,
          err,
          message: `Error while looking up account in the database. Reload page and try again.`
        });
      } else {
        if (foundAccount.userID.toString() !== userID.toString()) {
          res.send({
            success: false,
            message: `User ID does not match the account's user ID.`
          });
        } else {
          Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
            if (err || !foundCalendar) {
              res.send({
                success: false,
                err,
                message: `Error while looking up calendar in the database. Reload page and try again.`
              });
            } else {
              foundCalendar.accountIDs.push(accountID);
              foundCalendar.save();
              res.send({
                success: true,
                account: foundAccount,
                message: `Account successfully linked to calendar.`
              });
            }
          });
        }
      }
    });
  },
  unlinkSocialAccount: (req, res) => {
    const { accountID, calendarID } = req.body;
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: `Error while looking up calendar in database. Reload page and try again.`
        });
      } else {
        const accountIndex = foundCalendar.accountIDs.findIndex(
          actID => actID.toString() === accountID.toString()
        );
        if (accountIndex === -1) {
          res.send({
            success: false,
            message: `Unable to find account in the calendar's account list. Reload page and try again.`
          });
        } else {
          if (foundCalendar.adminID.toString() === userID.toString()) {
            foundCalendar.accountIDs.splice(accountIndex, 1);
            foundCalendar.save();
            res.send({ success: true });
          } else {
            // user is not the calendar's admin so we need to make sure they are the account's 'owner'
            Account.findOne({ _id: accountID }, (err, foundAccount) => {
              if (err || !foundAccount) {
                res.send({
                  success: false,
                  err,
                  message: `Error while looking up the account in the database. Reload page and try again.`
                });
              } else {
                if (foundAccount.userID.toString() !== userID.toString()) {
                  res.send({
                    success: false,
                    message: `User must be calendar admin or account 'creator' to remove it from the calendar.`
                  });
                } else {
                  foundCalendar.accountIDs.splice(accountIndex, 1);
                  foundCalendar.save();
                  res.send({ success: true });
                }
              }
            });
          }
        }
      }
    });
  },
  promoteUser: (req, res) => {
    const { userID, calendarID } = req.body;
    let thisUserID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        thisUserID = req.user.signedInAsUser.id;
      }
    }

    Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message:
            "Error while looking up calendar in database. Reload page and try again."
        });
      } else {
        // make sure that the requesting user is actually the admin
        // then make sure the user being promoted is actually in the calendar
        if (foundCalendar.adminID.toString() !== thisUserID.toString()) {
          res.send({
            success: false,
            message:
              "Only the current calendar admin can promote another user to admin. If you are the calendar admin, reload page and try again."
          });
        } else {
          const userIndex = foundCalendar.userIDs.findIndex(
            userid => userid.toString() === userID.toString()
          );
          if (userIndex === -1) {
            res.send({
              success: false,
              message:
                "User being promoted could not be found in the calendar's user list. Reload page and try again."
            });
          } else {
            foundCalendar.adminID = userID;
            foundCalendar.save();
            res.send({
              success: true,
              message: "User successfully promoted to new calendar admin."
            });
          }
        }
      }
    });
  },

  removePendingEmail: (req, res) => {
    const { calendarID, email } = req.body;

    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Calendar.findOne({ _id: calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: `Error while looking up calendar in database. Reload page and try again.`
        });
      } else {
        const emailIndex = foundCalendar.emailsInvited.findIndex(
          emailLoop => emailLoop.toString() === email.toString()
        );
        if (emailIndex === -1) {
          res.send({
            success: false,
            message: `Unable to find email in the calendar's email list. Reload page and try again.`
          });
        } else {
          if (foundCalendar.adminID.toString() === userID.toString()) {
            foundCalendar.emailsInvited.splice(emailIndex, 1);
            foundCalendar.save();
            res.send({ success: true });
          } else {
            res.send({
              success: false,
              message: `Only admins can remove users from a calendar. Reload your page if you are the admin of this calendar.`
            });
          }
        }
      }
    });
  }
};
