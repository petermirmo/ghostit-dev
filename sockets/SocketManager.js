const User = require("../models/User");
const Post = require("../models/Post");
const Blog = require("../models/Blog");
const Newsletter = require("../models/Newsletter");
const Campaign = require("../models/Campaign");
const Recipe = require("../models/Recipe");

module.exports = socket => {
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

  socket.on("disconnect", function() {});
};
