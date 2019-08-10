const moment = require("moment-timezone");
const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Recipe = require("../models/Recipe");
const Post = require("../models/Post");
const generalFunctions = require("./generalFunctions");

const deleteCampaignStandalone = (req, callback) => {
  const { campaignID } = req;
  Campaign.findOne({ _id: campaignID }, (err, foundCampaign) => {
    if (err || !foundCampaign) {
      callback({ success: false, err });
    } else {
      foundCampaign.remove();
      callback({ success: true });
    }
  });
};

module.exports = {
  getCampaigns: (req, res) => {
    // Get all posts for user
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Campaign.find({ userID }, async (err, campaigns) => {
      if (err) generalFunctions.handleError(res, err);
      else if (!campaigns)
        generalFunctions.handleError(res, "No campaigns found");
      else {
        let campaignArray = [];

        if (campaigns.length != 0) {
          for (let index in campaigns) {
            let campaign = campaigns[index];
            await Post.find({ _id: { $in: campaign.posts } }, (err, posts) => {
              if (err) generalFunctions.handleError(res, err);
              else {
                campaignArray.push({ campaign, posts });
                if (index == campaigns.length - 1) res.send({ campaignArray });
              }
            });
          }
        } else res.send({ campaignArray: [] });
      }
    });
  },
  getRecipes: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Recipe.find({}, (err, allRecipes) => {
      if (err) generalFunctions.handleError(res, err);
      else {
        for (let index = 0; index < allRecipes.length; index++) {
          User.findOne({ _id: allRecipes[index].userID }, (err, user) => {
            if (err) generalFunctions.handleError(res, err);
            else {
              if (user) allRecipes[index].creator = user.fullName;
              else allRecipes[index].creator = "Unknown";
              if (index === allRecipes.length - 1) {
                Recipe.find({ userID }, (err, usersRecipes) => {
                  res.send({ usersRecipes, allRecipes });
                });
              }
            }
          });
        }
      }
    });
  },

  saveRecipe: (req, res) => {
    // function called when a user makes a campaign in CampaignModal then tries to save it as a recipe
    // a different function is used when a user saves a campaign through the RecipeEditorModal
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    let { campaign, posts } = req.body;

    if (!campaign.recipeID) {
      let recipe = new Recipe();

      for (let index in campaign) {
        if (generalFunctions.indexChecks(index)) {
          recipe[index] = campaign[index];
        }
      }

      recipe.posts = posts;

      recipe.save();

      Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
        if (err) generalFunctions.handleError(res, err);
        else if (!foundCampaign) {
          // this happens when we are saving a recipe that isn't based off a saved campaign
          res.send({
            success: true,
            campaign: { ...campaign, recipeID: recipe._id }
          });
          return;
        }
        foundCampaign.recipeID = recipe._id;
        foundCampaign.save((err, savedCampaign) => {
          res.send({ success: true, campaign: savedCampaign });
        });
      });
    } else {
      Recipe.findOne({ _id: campaign.recipeID }, (err, foundRecipe) => {
        if (err) generalFunctions.handleError(res, err);
        else {
          if (!foundRecipe) {
            foundRecipe = new Recipe();
            foundRecipe.userID = userID;
          }
          if (String(userID) === String(foundRecipe.userID)) {
            for (let index in campaign) {
              if (generalFunctions.indexChecks(index)) {
                foundRecipe[index] = campaign[index];
              }
            }

            foundRecipe.posts = posts;

            foundRecipe.save((err, savedRecipe) => {
              if (err || !savedRecipe)
                generalFunctions.handleError(res, "Failed to save recipe");
              else {
                res.send({ success: true, recipe: savedRecipe });
              }
            });
          } else {
            generalFunctions.handleError(res, "Not your campaign!!");
          }
        }
      });
    }
  },
  deleteRecipe: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    let recipeID = req.params.recipeID;

    Recipe.findOne({ _id: recipeID }, (err, foundRecipe) => {
      if (err) generalFunctions.handleError(res, err);
      else if (foundRecipe) {
        if (String(userID) === String(foundRecipe.userID)) {
          foundRecipe.remove();
          res.send({ success: true });
        } else generalFunctions.handleError(res, "You have no power here.");
      } else generalFunctions.handleError(res, "Could not find recipe :/");
    });
  },
  deleteCampaignStandalone
};
