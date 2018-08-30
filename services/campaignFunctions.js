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
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    const { recipe, posts } = req.body;

    if (recipe.recipeID) {
      // recipe exists in DB already so we just need to overwrite its attributes
      Recipe.findOne({ _id: recipe.recipeID }, (err, foundRecipe) => {
        if (String(foundRecipe.userID) != userID) {
          res.send({
            success: false,
            message: "Only the recipe creator can edit the recipe."
          });
          return;
        } else {
          foundRecipe.name = recipe.name;
          foundRecipe.color = recipe.color;
          foundRecipe.length = new moment(recipe.endDate).diff(
            new moment(recipe.startDate)
          );
          foundRecipe.hour = new moment(recipe.startDate).format("H");
          foundRecipe.minute = new moment(recipe.startDate).format("mm");
          foundRecipe.posts = [];
          for (let index in posts) {
            let post = posts[index];
            foundRecipe.posts.push({
              socialType: post.socialType,
              instructions: post.instructions,
              name: post.name,
              postingDate: new moment(post.postingDate).diff(
                new moment(recipe.startDate)
              )
            });
          }
          foundRecipe.save((err, savedRecipe) => {
            res.send({
              success: true,
              recipe: savedRecipe
            });
          });
        }
      });
    } else {
      // recipe is being saved in DB for the first time
      let recipeToSave = new Recipe();
      recipeToSave.userID = userID;
      recipeToSave.name = recipe.name;
      recipeToSave.color = recipe.color;
      recipeToSave.length = new moment(recipe.endDate).diff(
        new moment(recipe.startDate)
      );
      recipeToSave.hour = new moment(recipe.startDate).format("H");
      recipeToSave.minute = new moment(recipe.startDate).format("mm");
      recipeToSave.posts = [];
      for (let index in posts) {
        let post = posts[index];
        recipeToSave.posts.push({
          socialType: post.socialType,
          instructions: post.instructions,
          name: post.name,
          postingDate: new moment(post.postingDate).diff(
            new moment(recipe.startDate)
          )
        });
      }
      recipeToSave.save((err, savedRecipe) => {
        res.send({
          success: true,
          recipe: savedRecipe
        });
      });
    }
  },
  saveCampaignAsRecipe: function(req, res) {
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

      recipe.userID = userID;
      recipe.name = campaign.name;
      recipe.color = campaign.color;
      recipe.length = new moment(campaign.endDate).diff(
        new moment(campaign.startDate)
      );
      recipe.hour = new moment(campaign.startDate).format("H");
      recipe.minute = new moment(campaign.startDate).format("mm");
      recipe.posts = [];

      for (let index in posts) {
        let post = posts[index];
        recipe.posts.push({
          socialType: post.post.socialType,
          instructions: post.post.instructions,
          name: post.post.name,
          postingDate: new moment(post.post.postingDate).diff(
            new moment(campaign.startDate)
          )
        });
      }
      recipe.save();

      Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
        foundCampaign.recipeID = recipe._id;
        foundCampaign.save((err, savedCampaign) => {
          res.send({ success: true, campaign: savedCampaign });
        });
      });
    } else {
      res.send({
        success: false,
        message: "You cannot create a new recipe from an existing recipe."
      });
    }
  }
};
