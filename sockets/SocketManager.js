const User = require("../models/User");
const Post = require("../models/Post");
const Blog = require("../models/Blog");
const Newsletter = require("../models/Newsletter");
const Campaign = require("../models/Campaign");
const Recipe = require("../models/Recipe");

searchAndRemoveSocketID = (connections, socketID) => {
  for (let index in connections) {
    for (let i = 0; i < connections[index].length; i++) {
      if (connections[index][i] === socketID) {
        connections[index].splice(i, 1);
        if (connections[index].length === 0 && index !== "unassigned") {
          delete connections[index];
        }
        return;
      }
    }
  }
};

module.exports = io => {
  let connections = {};
  connections["unassigned"] = [];
  /*
    Example of what the connections object might look like in action:
    {
      unassigned: [],
      '5bdccae8b4eb6714c40ccda2': [ 'MdioR1xA4NGrhkh-AAAC', '74r_L8aoH0f1ITAWAAAD' ],
      '5bdccaf1b4eb6714c40ccda4': [ 'Z_VwyvljqXhQLPrYAAAE' ]
    }
    This means no socketIDs are unassigned, two socketIDs are connected to the first calendarID
    and one socketID is connected to the second calendarID.
    This object allows us to easily send updates to all users connected to a specific calendar.
    (Say the user with socketID 'MdioR1xA4NGrhkh-AAAC' saves a new post.
      We can see that socketID '74r_L8aoH0f1ITAWAAAD' is also connected to the same calendarID,
      so we will send them a copy of that post so they can add it or update their existing version of that post)
  */

  return socket => {
    connections["unassigned"].push(socket.id);

    socket.on("calendar_connect", (calendarID, oldCalendarID) => {
      /*
        Potential security flaw here bcz we aren't checking the DB to make sure this user
        is actually a valid member of the calendar. So it's possible that a user could spoof
        their calendarID and then get access to any posts that are scheduled while they are
        connected to the socket.
        Not sure if it's worth the extra time to check the DB, and also I'm not sure how to
        get the req.user object from the socket.
      */
      calendarID = calendarID.toString();
      // shortcut to finding the socketIDs old place so we can remove it without having to search everywhere
      if (oldCalendarID) {
        oldCalendarID = oldCalendarID.toString();
        if (connections[oldCalendarID]) {
          const index = connections[oldCalendarID].findIndex(
            sockID => sockID === socket.id
          );
          if (index !== -1) {
            connections[oldCalendarID].splice(index, 1);
            if (connections[oldCalendarID].length === 0) {
              delete connections[oldCalendarID];
            }
            // put the socketID into the correct calendar bucket
            if (connections[calendarID]) {
              connections[calendarID].push(socket.id);
            } else {
              connections[calendarID] = [socket.id];
            }
            console.log(connections);
            return;
          }
        }
      }
      // haven't returned yet so there was no oldCalendarID or the socketID wasn't found in that bucket
      // check the "unassigned" bucket first as that's the most likely place
      const index = connections["unassigned"].findIndex(
        sockID => sockID === socket.id
      );
      if (index !== -1) {
        connections["unassigned"].splice(index, 1);
      } else {
        // not in "unassigned" so now we have to linear search for it
        searchAndRemoveSocketID(connections, socket.id);
      }
      // put the socketID into the correct calendar bucket
      if (connections[calendarID]) {
        connections[calendarID].push(socket.id);
      } else {
        connections[calendarID] = [socket.id];
      }
      console.log(connections);
    });

    socket.on("disconnect", () => {
      searchAndRemoveSocketID(connections, socket.id);
    });

    socket.on("trigger_socket_peers", reqObj => {
      io.emit("broadcast_to_peers", reqObj);
    });

    socket.on("new_campaign", campaign => {
      if (campaign) delete campaign._id;
      new Campaign(campaign).save((err, result) => {
        if (!err) {
          if (campaign.recipeID) {
            Recipe.findOne({ _id: campaign.recipeID }, (err, foundRecipe) => {
              if (foundRecipe) {
                if (!foundRecipe.useCount) {
                  foundRecipe.useCount = 1;
                } else {
                  foundRecipe.useCount = foundRecipe.useCount + 1;
                }

                foundRecipe.save();
              } else {
                console.log(
                  "campaign saved with a recipeID that could not be found (when attempting to increment the recipe.useCount)"
                );
              }
            });
          }
          socket.emit("new_campaign_saved", result._id);
        }
      });
    });

    socket.on("new_post", emitObject => {
      let { campaign, post } = emitObject;
      Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
        if (foundCampaign) {
          let index = foundCampaign.posts.findIndex(post_obj => {
            return post_obj._id == post._id;
          });
          if (index === -1) {
            foundCampaign.posts.push(post._id);
          }
          foundCampaign.save((err, savedCampaign) => {
            if (savedCampaign)
              socket.emit("post_added", { campaignPosts: savedCampaign.posts });
          });
        }
      });
    });

    socket.on("campaign_editted", campaign => {
      Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
        if (foundCampaign) {
          foundCampaign.name = campaign.name;
          foundCampaign.description = campaign.description;
          foundCampaign.startDate = campaign.startDate;
          foundCampaign.endDate = campaign.endDate;
          foundCampaign.color = campaign.color;
          foundCampaign.recipeID = campaign.recipeID;
          foundCampaign.save((err, result) => {
            socket.emit("campaign_saved", { campaign: result });
          });
        }
      });
    });

    socket.on("close", campaign => {
      if (campaign.posts) {
        if (campaign.posts.length === 0) {
          Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
            if (foundCampaign) {
              if (foundCampaign.recipeID) {
                Recipe.findOne(
                  { _id: foundCampaign.recipeID },
                  (err, foundRecipe) => {
                    if (foundRecipe) {
                      if (foundRecipe.useCount) {
                        foundRecipe.useCount = foundRecipe.useCount - 1;
                      } else {
                        foundRecipe.useCount = 0;
                      }
                      foundRecipe.save();
                    }
                  }
                );
              }
              foundCampaign.remove();
            }
          });
        }
      } else {
        Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
          if (foundCampaign) {
            if (foundCampaign.recipeID) {
              Recipe.findOne(
                { _id: foundCampaign.recipeID },
                (err, foundRecipe) => {
                  if (foundRecipe) {
                    if (foundRecipe.useCount) {
                      foundRecipe.useCount = foundRecipe.useCount - 1;
                    } else {
                      foundRecipe.useCount = 0;
                    }
                    foundRecipe.save();
                  }
                }
              );
            }
            foundCampaign.remove();
          }
        });
      }
      socket.disconnect();
    });

    socket.on("delete", campaign => {
      Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
        if (foundCampaign) {
          if (foundCampaign.posts) {
            for (let index = 0; index < foundCampaign.posts.length; index++) {
              let post = foundCampaign.posts[index];

              Post.findOne({ _id: post._id }, (err, foundPost) => {
                if (foundPost) foundPost.remove();
              });
            }
          }
          if (foundCampaign.recipeID) {
            Recipe.findOne(
              { _id: foundCampaign.recipeID },
              (err, foundRecipe) => {
                if (foundRecipe) {
                  if (!foundRecipe.useCount) {
                    foundRecipe.useCount = 0;
                  } else {
                    foundRecipe.useCount = foundRecipe.useCount - 1;
                  }
                  foundRecipe.save();
                }
              }
            );
          }
          foundCampaign.remove();
        }
      });
    });

    socket.on("delete-post", emitObject => {
      // listener that will delete the post id from its campaign and then delete the actual post
      // does not delete single posts that aren't tied to a campaign.
      const { post, campaign } = emitObject;
      let removedFromCampaign = false;
      let removedPost = false;
      let newCampaign = undefined;
      Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
        if (foundCampaign) {
          if (foundCampaign.posts) {
            while (
              (index = foundCampaign.posts.findIndex(post_obj => {
                if (!post_obj) return false;
                return post_obj._id == post._id;
              })) !== -1
            ) {
              foundCampaign.posts = [
                ...foundCampaign.posts.slice(0, index),
                ...foundCampaign.posts.slice(index + 1)
              ];
            }
            foundCampaign.save((err, savedCampaign) => {
              if (err || !savedCampaign) {
                socket.emit("post-deleted", {
                  removedFromCampaign,
                  removedPost,
                  newCampaign
                });
              } else {
                removedFromCampaign = true;
                newCampaign = savedCampaign;
                Post.findOne({ _id: post._id }, (err, foundPost) => {
                  if (foundPost) {
                    foundPost.remove();
                    removedPost = true;
                    socket.emit("post-deleted", {
                      removedFromCampaign,
                      removedPost,
                      newCampaign
                    });
                  } else {
                    socket.emit("post-deleted", {
                      removedFromCampaign,
                      removedPost,
                      newCampaign
                    });
                  }
                });
              }
            });
          } else {
            socket.emit("post-deleted", {
              removedFromCampaign,
              removedPost,
              newCampaign
            });
          }
        } else {
          socket.emit("post-deleted", {
            removedFromCampaign,
            removedPost,
            newCampaign
          });
        }
      });
    });
  };
};
