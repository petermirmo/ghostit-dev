const User = require("../models/User");
const Account = require("../models/Account");
const Calendar = require("../models/Calendar");
const Blog = require("../models/Blog");
const Post = require("../models/Post");
const Newsletter = require("../models/Newsletter");
const Campaign = require("../models/Campaign");

const generalFunctions = require("./generalFunctions");

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
              Blog.find(
                { userID, calendarID: undefined },
                (err, foundBlogs) => {
                  if (err || !foundBlogs) {
                    console.log(
                      `Error while trying to fetch all old blogs to link to new calendar.`
                    );
                  } else {
                    for (let i = 0; i < foundBlogs.length; i++) {
                      const blog = foundBlogs[i];
                      blog.calendarID = newCalendar._id;
                      blog.save();
                    }
                  }
                }
              );
              Newsletter.find(
                { userID, calendarID: undefined },
                (err, foundNewsletters) => {
                  if (err || !foundNewsletters) {
                    console.log(
                      `Error while trying to fetch all old newsletters to link to new calendar.`
                    );
                  } else {
                    for (let i = 0; i < foundNewsletters.length; i++) {
                      const newsletter = foundNewsletters[i];
                      newsletter.calendarID = newCalendar._id;
                      newsletter.save();
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
              const defaultCalendarIndex = foundCalendars.findIndex(calObj => {
                return (
                  calObj._id.toString() ===
                  foundUser.defaultCalendarID.toString()
                );
              });
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
          Post.find(
            { calendarID: req.params.calendarID, campaignID: undefined },
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
                res.send({
                  success: true,
                  blogs: foundBlogs
                });
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
                res.send({
                  success: true,
                  newsletters: foundNewsletters
                });
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
                fillCampaignPosts(res, foundCampaigns);
              }
            }
          );
        }
      }
    });
  },
  createNewCalendar: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    const newCalendar = new Calendar();
    newCalendar.calendarName = req.body.name;
    newCalendar.adminID = userID;
    newCalendar.userIDs = [userID];

    newCalendar.save().then(() => {
      res.send({ success: true, newCalendar });
    });
  },
  getUsers: function(req, res) {
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
        User.find({ $or: userIDList }, "fullName email", (err, foundUsers) => {
          if (err || !foundUsers) {
            res.send({
              success: false,
              err,
              message: `Unable to find users subscribed to calendar with id ${id}`
            });
          } else {
            res.send({
              success: true,
              users: foundUsers,
              userIDs: foundCalendar.userIDs
            });
          }
        });
      }
    });
  },
  inviteUser: function(req, res) {
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
  getCalendarInvites: function(req, res) {
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
  calendarInviteResponse: function(req, res) {
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
  renameCalendar: function(req, res) {
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
  removeUserFromCalendar: function(req, res) {
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
  deleteCalendar: function(req, res) {
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
          message: `Error while fetching user from database.`
        });
      } else {
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
                  // calendar is eligible to be deleted and the user is the calendar admin
                  // now we must delete all posts with post.calendarID: calendarID
                  Post.find({ calendarID }, (err, foundPosts) => {
                    if (err || !foundPosts) {
                      res.send({
                        success: false,
                        message: `Error while fetching all calendar posts to be deleted.`
                      });
                    } else {
                      for (let i = 0; i < foundPosts.length; i++) {
                        const post = foundPosts[i];
                        post.remove();
                      }
                      Campaign.find({ calendarID }, (err, foundCampaigns) => {
                        if (err || !foundCampaigns) {
                          res.send({
                            success: false,
                            message: `Error while fetching all calendar campaigns to be deleted. Posts already deleted.`
                          });
                        } else {
                          for (let i = 0; i < foundCampaigns.length; i++) {
                            const campaign = foundCampaigns[i];
                            campaign.remove();
                          }
                          Blog.find({ calendarID }, (err, foundBlogs) => {
                            if (err || !foundBlogs) {
                              res.send({
                                success: false,
                                message: `Error while fetching all calendar blogs to be deleted. Posts and campaigns already deleted.`
                              });
                            } else {
                              for (let i = 0; i < foundBlogs.length; i++) {
                                const blog = foundBlogs[i];
                                blog.remove();
                              }
                              Newsletter.find(
                                { calendarID },
                                (err, foundNewsletters) => {
                                  if (err || !foundNewsletters) {
                                    res.send({
                                      success: false,
                                      message: `Error while fetching all calendar newsletters to be deleted. Posts, campaigns, and blogs already deleted.`
                                    });
                                  } else {
                                    for (
                                      let i = 0;
                                      i < foundNewsletters.length;
                                      i++
                                    ) {
                                      const newsletter = foundNewsletters[i];
                                      newsletter.remove();
                                    }
                                    foundCalendar.remove();
                                    let newCalendar = undefined;
                                    if (foundCalendars.length === 1) {
                                      // deleting the user's only calendar so we need to replace it with a new one
                                      newCalendar = new Calendar();
                                      newCalendar.adminID = userID;
                                      newCalendar.userIDs = [userID];
                                      newCalendar.calendarName = "Calendar 1";
                                      newCalendar.save();
                                    }
                                    res.send({
                                      success: true,
                                      newCalendar,
                                      message: `Calendar deleted as well as ${
                                        foundPosts.length
                                      } posts, ${
                                        foundCampaigns.length
                                      } campaigns, ${
                                        foundBlogs.length
                                      } blogs, and ${
                                        foundNewsletters.length
                                      } newsletters.`
                                    });
                                  }
                                }
                              );
                            }
                          });
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
    });
  },
  setDefaultCalendar: function(req, res) {
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
  getSocialAccounts: function(req, res) {
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
  getSocialAccountsExtra: function(req, res) {
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
  linkSocialAccount: function(req, res) {
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
  unlinkSocialAccount: function(req, res) {
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
  }
};
