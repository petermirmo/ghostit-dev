const moment = require("moment-timezone");
const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Recipe = require("../models/Recipe");
const Post = require("../models/Post");

module.exports = {
  getCampaigns: function(req, res) {
    // Get all posts for user
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Campaign.find({ userID: userID }, async (err, campaigns) => {
      if (err) res.send({ error: err });
      var campaignArray = [];

      if (campaigns.length != 0) {
        for (let index in campaigns) {
          let campaign = campaigns[index];
          await Post.find({ _id: { $in: campaign.posts } }, (err, posts) => {
            campaignArray.push({ campaign, posts });
            if (index == campaigns.length - 1) res.send({ campaignArray });
          });
        }
      } else res.send({ campaignArray: [] });
    });
  },
  getRecipes: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Recipe.find({}, (err, allRecipes) => {
      Recipe.find({ userID }, (err, usersRecipes) => {
        res.send({ usersRecipes, allRecipes });
      });
    });
  },

  saveRecipe: function(req, res) {
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
      const recipeID = recipe._id;

      for (let index in campaign) {
        recipe[index] = campaign[index];
      }

      recipe._id = recipeID;

      recipe.posts = posts;

      recipe.save();

      Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
        foundCampaign.recipeID = recipe._id;
        foundCampaign.save((err, savedCampaign) => {
          res.send({ success: true, campaign: savedCampaign });
        });
      });
    } else {
      Recipe.findOne({ _id: campaign.recipeID }, (err, foundRecipe) => {
        if (String(userID) === String(foundRecipe.userID)) {
          const recipeID = foundRecipe._id;
          for (let index in campaign) {
            foundRecipe[index] = campaign[index];
          }

          foundRecipe._id = recipeID;
          foundRecipe.posts = posts;

          foundRecipe.save();

          Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
            foundCampaign.recipeID = foundRecipe._id;
            foundCampaign.save((err, savedCampaign) => {
              res.send({ success: true, campaign: savedCampaign });
            });
          });
        } else {
          res.send({ success: false, message: "Not your campaign!!" });
        }
      });
    }
  },
  deleteRecipe: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    let recipeID = req.params.recipeID;

    Recipe.findOne({ _id: recipeID }, (err, foundRecipe) => {
      if (foundRecipe) {
        if (String(userID) === String(foundRecipe.userID)) {
          foundRecipe.remove();
          res.send({ success: true });
        } else res.send({ success: false, message: "You have no power here." });
      } else res.send({ success: false, message: "Could not find recipe :/" });
    });
  }
};
