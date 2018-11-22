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

getUsersInRoom = (rooms, room, connections) => {
  // getUsersInRoom(io.sockets.adapter.rooms, calendarID, connections);
  if (!rooms[room]) return undefined;
  const socketIDs = [];
  for (let index in rooms[room].sockets) {
    socketIDs.push(index);
  }
  const emails = [];
  for (let i = 0; i < socketIDs.length; i++) {
    emails.push(connections[socketIDs[i]]);
  }
  return emails;
};

getRoomsThatSocketIsIn = (rooms, socketID) => {
  let result = [];
  for (let index in rooms) {
    if (rooms[index].sockets[socketID]) result.push(index);
  }
  return result;
};

emitSocketUsersToRooms = (roomsToEmit, io, rooms, connections) => {
  for (let i = 0; i < roomsToEmit.length; i++) {
    const userList = getUsersInRoom(rooms, roomsToEmit[i], connections);
    if (!userList) continue; // this happens when the user just left a room and was the only user in the room (so the room no longer exists)
    io.in(roomsToEmit[i]).emit("socket_user_list", {
      roomID: roomsToEmit[i],
      userList
    });
  }
};

module.exports = io => {
  /*
    Sockets used by the ContentPage will be used as follows:
      Each socket will be connected to ONE room.
      That room's name/key will be the calendarID that the socket's client has active.
      Whenever a user makes a change to their calendar, they will socket.emit
        which will be forwarded to all other sockets within that room.

      connections object will be used as follows:
        {
          "fngn4563f": "Patrick Holland",
          "53jbdb22g": "Datrick Bolland"
        }
      where the key is a socket.id and the value is the name of the user who 'owns' that socket.id

      Then when we want to know who are all the users in any given room (io.sockets.adapter.rooms[calendarID]),
        we can see the socket.id's of all the users in the room and then use this connections object
        to find out their name.
  */
  const connections = {};

  return socket => {
    socket.on("calendar_connect", reqObj => {
      /*
        Potential security flaw here bcz we aren't checking the DB to make sure this user
        is actually a valid member of the calendar. So it's possible that a user could spoof
        their calendarID and then get access to any posts that are scheduled while they are
        connected to the socket.
        Not sure if it's worth the extra time to check the DB, and also I'm not sure how to
        get the req.user object from the socket.
      */
      let { calendarID, name } = reqObj;
      if (!calendarID) return;
      calendarID = calendarID.toString();
      const socketID = socket.id.toString();

      let roomsToEmit = getRoomsThatSocketIsIn(
        io.sockets.adapter.rooms,
        socketID
      );

      socket.leaveAll();
      socket.join(calendarID);

      if (!connections[socketID]) {
        connections[socketID] = name;
      }

      roomsToEmit.push(calendarID);

      emitSocketUsersToRooms(
        roomsToEmit,
        io,
        io.sockets.adapter.rooms,
        connections
      );
    });

    socket.on("disconnect", () => {
      const socketID = socket.id.toString();
      delete connections[socketID];
    });

    socket.on("unmounting_socket_component", () => {
      // socket.on("disonnect") is triggered AFTER the socket leaves all of their rooms
      // so we can't figure out which rooms to emit a new user list to.
      // instead, we get those users to trigger this when their component unmounts
      const socketID = socket.id.toString();

      let roomsToEmit = getRoomsThatSocketIsIn(
        io.sockets.adapter.rooms,
        socketID
      );
      socket.leaveAll();
      emitSocketUsersToRooms(
        roomsToEmit,
        io,
        io.sockets.adapter.rooms,
        connections
      );
    });

    socket.on("trigger_socket_peers", reqObj => {
      const { calendarID, campaignID, type } = reqObj;
      let extra = reqObj.extra;
      if (campaignID) extra = { calendarID, campaignID, extra };
      if (calendarID && type) {
        socket.to(calendarID.toString()).emit(type, extra);
      }
    });

    socket.on("campaign_connect", reqObj => {
      /*
        maintain "rooms" for campaignIDs so that if 2 or more users are working on the same
        campaign at the same time, they will get real-time updates from each other's work
      */
      let { campaignID, name } = reqObj;
      const socketID = socket.id.toString();
      campaignID = campaignID.toString();
      if (!campaignID) return;

      let roomsToEmit = getRoomsThatSocketIsIn(
        io.sockets.adapter.rooms,
        socketID
      );

      socket.leaveAll();
      socket.join(campaignID);

      roomsToEmit.push(campaignID);

      if (!connections[socketID]) {
        connections[socketID] = name;
      }

      emitSocketUsersToRooms(
        roomsToEmit,
        io,
        io.sockets.adapter.rooms,
        connections
      );
    });

    socket.on("trigger_campaign_peers", reqObj => {
      const { campaignID, type, extra } = reqObj;
      if (campaignID && type) {
        socket.to(campaignID.toString()).emit(type, extra);
      }
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
