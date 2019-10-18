const cloudinary = require("cloudinary");

const User = require("../models/User");
const Calendar = require("../models/Calendar");
const Post = require("../models/Post");
const Campaign = require("../models/Campaign");
const Recipe = require("../models/Recipe");

const postFunctions = require("../services/postFunctions");

const chatHistoryMessagesToFetchEachRequest = 10;

searchAndRemoveSocketID = (connections, socketID) => {
  for (let index in connections) {
    for (let i = 0; i < connections[index].length; i++) {
      if (connections[index][i] === socketID) {
        connections[index].name.splice(i, 1);
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
  const users = [];
  for (let index in rooms[room].sockets) {
    users.push(connections[index]);
  }
  return users;
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

    To get access to the socket's user object, use socket.request.user
      (similar to req.user in axios requests)
    console.log("user:");
    console.log(socket.request.user);
  */
  const connections = {};

  return socket => {
    socket.on("calendar_chat_connect", reqObj => {
      // need to make sure user is authorized for all the calendars in their list
      // and then add the socket.id to all those calendars' chat rooms
      const { calendarIDList } = reqObj;
      if (!calendarIDList || calendarIDList.length === 0) return;

      let userID = socket.request.user._id;
      if (socket.request.user.signedInAsUser) {
        if (socket.request.user.signedInAsUser.id) {
          userID = socket.request.user.signedInAsUser.id;
        }
      }

      Calendar.find(
        { $or: calendarIDList, userIDs: userID },
        (err, foundCalendars) => {
          if (err || !foundCalendars) {
            socket.emit("calendar_chat_connect_error", {
              err,
              message:
                "Error occurred while connecting to your calendar's chat rooms. Reload the page to try connecting again."
            });
          } else {
            socket.leaveAll();
            for (let i = 0; i < foundCalendars.length; i++) {
              const calendarID = foundCalendars[i]._id.toString();
              socket.join(`${calendarID}-chat`);
            }
          }
        }
      );
    });

    socket.on("calendar_chat_message_send", reqObj => {
      // user is sending a new chat message to the designated calendar
      // we need to store the message in the DB
      // then notify all users that are subscribed to this calendar's chat
      const { calendarID, inputText } = reqObj;

      let userID = socket.request.user._id;
      let name = socket.request.user.fullName;
      if (socket.request.user.signedInAsUser) {
        if (socket.request.user.signedInAsUser.id) {
          userID = socket.request.user.signedInAsUser.id;
          name = `"${name}" signed in as "${socket.request.user.signedInAsUser.fullName}"`;
        }
      }

      Calendar.findOne(
        { _id: calendarID, userIDs: userID },
        (err, foundCalendar) => {
          if (err) {
            console.log(err);
          } else if (!foundCalendar) {
            console.log(
              "user trying to send a message to an unauthorized calendar."
            );
          } else {
            const msgObj = {
              username: name,
              userEmail: socket.request.user.email,
              content: inputText,
              edited: false
            };
            foundCalendar.chatHistory.push(msgObj);
            foundCalendar.save((err, savedCalendar) => {
              if (savedCalendar && savedCalendar.chatHistory) {
                const savedMsgObj =
                  savedCalendar.chatHistory[
                    savedCalendar.chatHistory.length - 1
                  ];
                socket.emit("calendar_chat_message_received", savedMsgObj);
                const socketRoom = `${calendarID.toString()}-chat`;
                socket.to(socketRoom).emit("calendar_chat_message_broadcast", {
                  calendarID,
                  savedMsgObj
                });
              }
            });
          }
        }
      );
    });

    socket.on("calendar_chat_opened", reqObj => {
      const { calendarID, timestamp } = reqObj;

      let userID = socket.request.user._id;
      if (socket.request.user.signedInAsUser) {
        if (socket.request.user.signedInAsUser.id) {
          // the user didn't actually read the message so don't update anything
          return;
        }
      }

      Calendar.findOne(
        { _id: calendarID, userIDs: userID },
        (err, foundCalendar) => {
          if (err || !foundCalendar) {
            console.log(err);
            console.log(
              "error while looking up calendar in db in socket.on('calendar_chat_opened');"
            );
          } else {
            const index = foundCalendar.chatLastOpened.findIndex(
              obj => obj.userID.toString() === userID.toString()
            );

            if (index === -1) {
              foundCalendar.chatLastOpened.push({ userID, timestamp });
            } else {
              foundCalendar.chatLastOpened[index].timestamp = timestamp;
            }
            foundCalendar.save((err, savedCalendar) => {
              if (!err) {
                socket.emit(
                  "calendar_chat_opened_response",
                  savedCalendar.chatLastOpened
                );
              }
            });
          }
        }
      );
    });

    socket.on("calendar_chat_request_more_messages", reqObj => {
      const { calendarID, clientChatHistoryLength } = reqObj;

      let userID = socket.request.user._id;
      if (socket.request.user.signedInAsUser) {
        if (socket.request.user.signedInAsUser.id) {
          userID = socket.request.user.signedInAsUser.id;
        }
      }

      const elementIndexToStartAt =
        -1 * (clientChatHistoryLength + chatHistoryMessagesToFetchEachRequest);
      const elementsToFetch = chatHistoryMessagesToFetchEachRequest;
      /*
        example of what $slice: [num1, num2] does:
          {
            attr1: 4,
            array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          }
          $slice: [-5, 2]
          {
            attr1: 4,
            array: [6, 7]
          }
          (start at the 5th last element in the array and return the next 2 elements)

        the client tells us how many messages they have loaded already
        so if they have 50 messages loaded already, and elementsToFetch is 10,
        then they need the 60th to 51st last messages.
        so we'd start at (-1 * (50 + 10)) and grab the next 10 elements
      */

      Calendar.findOne(
        { _id: calendarID, userIDs: userID },
        { chatHistory: { $slice: [elementIndexToStartAt, elementsToFetch] } },
        (err, foundCalendar) => {
          if (err || !foundCalendar) {
            socket.emit("calendar_chat_send_more_messages", { error: true });
          } else {
            socket.emit("calendar_chat_send_more_messages", {
              calendarID: foundCalendar._id,
              newMessages: foundCalendar.chatHistory
            });
          }
        }
      );
    });

    socket.on("calendar_connect", reqObj => {
      let { calendarID, name, email } = reqObj;

      if (!calendarID) return;
      calendarID = calendarID.toString();
      const socketID = socket.id.toString();

      let userID = socket.request.user._id;
      if (socket.request.user.signedInAsUser) {
        if (socket.request.user.signedInAsUser.id) {
          userID = socket.request.user.signedInAsUser.id;
          name = `"${name}" signed in as "${socket.request.user.signedInAsUser.fullName}"`;
        }
      }

      Calendar.findOne(
        { _id: calendarID, userIDs: userID },
        (err, foundCalendar) => {
          if (err) {
            console.log(err);
          } else if (!foundCalendar) {
            console.log("unable to find user within the calendar's user list.");
          } else {
            let roomsToEmit = getRoomsThatSocketIsIn(
              io.sockets.adapter.rooms,
              socketID
            );

            socket.leaveAll();
            socket.join(calendarID);

            if (!connections[socketID]) {
              connections[socketID] = { name, email };
            }

            roomsToEmit.push(calendarID);

            emitSocketUsersToRooms(
              roomsToEmit,
              io,
              io.sockets.adapter.rooms,
              connections
            );
          }
        }
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
      let { campaignID, name, email } = reqObj;
      const socketID = socket.id.toString();
      campaignID = campaignID.toString();
      if (!campaignID) return;

      let userID = socket.request.user._id;
      if (socket.request.user.signedInAsUser) {
        if (socket.request.user.signedInAsUser.id) {
          userID = socket.request.user.signedInAsUser.id;
          name = `"${name}" signed in as "${socket.request.user.signedInAsUser.fullName}"`;
        }
      }

      Campaign.findOne({ _id: campaignID }, (err, foundCampaign) => {
        if (err || !foundCampaign) {
          console.log(err);
          console.log(
            "error while looking up campaign in DB to make sure new socket connection is authorized."
          );
        } else {
          Calendar.findOne(
            { _id: foundCampaign.calendarID, userIDs: userID },
            (err, foundCalendar) => {
              if (err) {
                console.log(err);
              } else if (!foundCalendar) {
                console.log(
                  "unable to find user within the calendar's user list."
                );
              } else {
                let roomsToEmit = getRoomsThatSocketIsIn(
                  io.sockets.adapter.rooms,
                  socketID
                );

                socket.leaveAll();
                socket.join(campaignID);

                roomsToEmit.push(campaignID);

                if (!connections[socketID]) {
                  connections[socketID] = { name, email };
                }

                emitSocketUsersToRooms(
                  roomsToEmit,
                  io,
                  io.sockets.adapter.rooms,
                  connections
                );
              }
            }
          );
        }
      });
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
            let deletedCount = 0;
            let failedCount = 0;
            if (foundCampaign.posts.length !== 0) {
              for (let index = 0; index < foundCampaign.posts.length; index++) {
                let post = foundCampaign.posts[index];
                postFunctions.deletePostStandalone(
                  { postID: post._id, skipUserCheck: true },
                  response => {
                    const { success } = response;
                    if (success) deletedCount++;
                    else failedCount++;
                    if (
                      deletedCount + failedCount >=
                      foundCampaign.posts.length
                    ) {
                      // this is the last post being deleted
                      if (failedCount > 0) {
                        // didn't get all of the posts deleted successfully so we shouldn't delete the campaign yet
                        socket.emit("campaign_deleted", false);
                      } else {
                        // all posts were deleted succesfully so we can delete the campaign
                        foundCampaign.remove();
                        socket.emit("campaign_deleted", true);
                      }
                    }
                  }
                );
              }
            } else {
              foundCampaign.remove();
              socket.emit("campaign_deleted", true);
            }
          } else {
            foundCampaign.remove();
            socket.emit("campaign_deleted", true);
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
                Post.findOne({ _id: post._id }, async (err, foundPost) => {
                  if (foundPost) {
                    if (foundpost.files) {
                      for (let i = 0; i < foundpost.files.length; i++) {
                        await cloudinary.uploader.destroy(
                          foundpost.files[i].publicID,
                          function(result) {
                            // TO DO: handle error here
                          }
                        );
                      }
                    }
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
