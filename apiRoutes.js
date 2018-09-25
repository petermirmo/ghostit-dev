const passport = require("passport");
const User = require("./models/User");
const Account = require("./models/Account");
const FB = require("fb");
const Post = require("./models/Post");

const multipart = require("connect-multiparty");
const fileParser = multipart();

const facebookFunctions = require("./services/facebookFunctions");
const linkedinFunctions = require("./services/linkedinFunctions");
const accountFunctions = require("./services/accountFunctions");
const userFunctions = require("./services/userFunctions");
const postFunctions = require("./services/postFunctions");
const campaignFunctions = require("./services/campaignFunctions");
const blogFunctions = require("./services/websiteBlogFunctions");
const newsletterFunctions = require("./services/newsletterFunctions");
const generalFunctions = require("./services/generalFunctions");
const strategyFunctions = require("./services/strategyFunctions");
const adminFunctions = require("./services/adminFunctions");
const planFunctions = require("./services/planFunctions");
const writersBriefFunctions = require("./services/writersBriefFunctions");
const SendMailFunctions = require("./MailFiles/SendMailFunctions");
const analyticsFunctions = require("./services/analyticsFunctions");

module.exports = app => {
  var middleware = function(req, res, next) {
    if (!req.user) {
      res.send({ success: false, loggedIn: false });
      return;
    }
    next();
  };

  if (process.env.NODE_ENV === "production") {
    app.get("/*", function(req, res, next) {
      if (req.headers.host.match(/^www/) == null)
        res.redirect(301, "http://www." + req.headers.host + req.url);
      else next();
    });
  }
  // Login user
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local-login", function(err, user, message) {
      let success = true;

      if (err) success = false;
      if (!user) success = false;

      if (success) {
        req.logIn(user, function(err) {
          if (err) {
            success = false;
            message =
              "Could not log you in! :( Please refresh the page and try again :)";
          }
          res.send({ success, user, message });
        });
      } else {
        res.send({ success, message });
      }
    })(req, res, next);
  });
  // Register user
  app.post("/api/register", (req, res, next) => {
    passport.authenticate("local-signup", function(notUsed, user, message) {
      let success = true;
      if (!user) success = false;
      if (success) {
        req.logIn(user, function(err) {
          if (err) {
            success = false;
            message =
              "Could not log you in! :( Please refresh the page and try again :)";
          }
          res.send({ success, user, message });
        });
      } else {
        res.send({ success, message });
      }
    })(req, res, next);
  });
  // Update user account
  app.post("/api/user/id", middleware, (req, res) =>
    userFunctions.updateUser(req, res)
  );
  // Get current user
  app.get("/api/user", middleware, (req, res) =>
    userFunctions.currentUser(req, res)
  );

  // Get user invoices
  app.get("/api/user/invoices", middleware, (req, res) =>
    userFunctions.userInvoices(req, res)
  );
  // Logout user
  app.get("/api/logout", middleware, (req, res) => {
    req.session.destroy();
    res.send({ success: true });
  });

  // Middleware check
  app.get("/api/isUserSignedIn", middleware, (req, res) => {
    if (req.user) {
      res.send({ success: true, user: req.user });
    } else {
      res.send({ success: false });
    }
  });

  // Save account to database
  app.post("/api/account", middleware, (req, res) =>
    accountFunctions.saveAccount(req, res)
  );
  // Delete account
  app.delete("/api/account/:accountID", middleware, (req, res) =>
    accountFunctions.disconnectAccount(req, res)
  );
  // Get all accounts that a user has connected
  app.get("/api/accounts", middleware, (req, res) =>
    accountFunctions.getAccounts(req, res)
  );

  // Add Facebook profile
  app.get(
    "/api/facebook",
    passport.authenticate("facebook", {
      scope: [
        "public_profile",
        "email",
        "publish_pages",
        "manage_pages",
        "business_management",
        "read_insights",
        "instagram_basic"
      ]
    })
  );
  // Facebook callback
  app.get(
    "/api/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/"
    })
  );

  app.get("/api/facebook/page/analytics/:accountID", middleware, (req, res) => {
    if (req.params.accountID === "all") {
      accountFunctions.getAllFacebookPageAnalytics(req, res);
    } else {
      accountFunctions.getPageAnalytics(req, res);
    }
  });

  app.get("/api/facebook/post/analytics/:postID", middleware, (req, res) =>
    accountFunctions.getPostAnalytics(req, res)
  );

  // Add Twitter account
  app.get("/api/twitter", passport.authenticate("twitter"));
  // Twitter callback
  app.get(
    "/api/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "/",
      failureRedirect: "/"
    })
  );

  // Get Facebook pages of profile accounts
  app.get("/api/facebook/pages", middleware, (req, res) =>
    facebookFunctions.getFacebookPages(req, res)
  );
  // Get Facebook groups of profile accounts
  app.get("/api/facebook/groups", middleware, (req, res) =>
    facebookFunctions.getFacebookGroups(req, res)
  );
  // Get Instagram pages
  app.get("/api/instagram/pages", middleware, (req, res) =>
    facebookFunctions.getInstagramPages(req, res)
  );

  // Add Linkedin account
  app.get("/api/linkedin", middleware, (req, res) =>
    linkedinFunctions.getLinkedinCode(req, res)
  );
  // Linkedin callback
  app.get("/api/linkedin/callback", middleware, (req, res) =>
    linkedinFunctions.getLinkedinAccessToken(req, res)
  );
  // Get Linkedin pages of profile account
  app.get("/api/linkedin/pages", middleware, (req, res) =>
    linkedinFunctions.getLinkedinPages(req, res)
  );

  // Get images from a URL and send back to client
  app.post("/api/link", middleware, (req, res) =>
    postFunctions.getImagesFromUrl(req, res)
  );

  // Save post
  app.post("/api/post", middleware, (req, res) =>
    postFunctions.savePost(req, res)
  );
  // Get all of user's posts
  app.get("/api/posts", middleware, (req, res) =>
    postFunctions.getPosts(req, res)
  );
  // Get post
  app.get("/api/post/:postID", middleware, (req, res) =>
    postFunctions.getPost(req, res)
  );
  // Update post
  app.post("/api/post/update/:postID", middleware, (req, res) =>
    postFunctions.updatePost(req, res)
  );
  // Delete post
  app.delete("/api/post/delete/:postID", middleware, (req, res) =>
    postFunctions.deletePost(req, res)
  );
  // Save post images
  app.post("/api/post/images", fileParser, middleware, async (req, res) =>
    postFunctions.uploadPostImages(req, res)
  );
  // Delete post images
  app.post("/api/post/delete/images/:postID", middleware, (req, res) =>
    postFunctions.deletePostImages(req, res)
  );

  // Get all of user's campaigns
  app.get("/api/campaigns", middleware, (req, res) =>
    campaignFunctions.getCampaigns(req, res)
  );
  // Save campaign as recipe
  app.post("/api/recipe", middleware, (req, res) =>
    campaignFunctions.saveRecipe(req, res)
  );
  // Get all recipes
  app.get("/api/recipes", middleware, (req, res) =>
    campaignFunctions.getRecipes(req, res)
  );
  app.delete("/api/recipe/:recipeID", middleware, (req, res) =>
    campaignFunctions.deleteRecipe(req, res)
  );

  // Create a blog placeholder
  app.post("/api/blog", fileParser, middleware, async (req, res) =>
    blogFunctions.saveBlog(req, res)
  );
  // Update blog
  app.post("/api/blog/:blogID", fileParser, middleware, async (req, res) =>
    blogFunctions.saveBlog(req, res)
  );
  // Delete blog
  app.delete("/api/blog/delete/:blogID", middleware, (req, res) =>
    blogFunctions.deleteBlog(req, res)
  );
  // Get all placeholder blogs
  app.get("/api/blogs", middleware, (req, res) =>
    blogFunctions.getBlogs(req, res)
  );

  // Create a newsletter placeholder
  app.post("/api/newsletter", fileParser, middleware, async (req, res) =>
    newsletterFunctions.saveNewsletter(req, res)
  );
  // Update newsletter
  app.post(
    "/api/newsletter/:newsletterID",
    fileParser,
    middleware,
    async (req, res) => newsletterFunctions.saveNewsletter(req, res)
  );
  // Delete newsletter
  app.delete("/api/newsletter/delete/:newsletterID", middleware, (req, res) =>
    newsletterFunctions.deleteNewsletter(req, res)
  );
  // Get all placeholder newsletters
  app.get("/api/newsletters", middleware, (req, res) =>
    newsletterFunctions.getNewsletters(req, res)
  );

  // Delete file in cloudinary using pulbic id
  app.delete("/api/delete/file/:publicID", middleware, (req, res) =>
    generalFunctions.deleteFile(req, res)
  );

  // Create or update user's strategy
  app.post("/api/strategy", middleware, (req, res) =>
    strategyFunctions.saveStrategy(req, res)
  );
  app.get("/api/strategy", middleware, (req, res) =>
    strategyFunctions.getStrategy(req, res)
  );

  // Get public plans
  app.get("/api/user/plan", middleware, (req, res) =>
    planFunctions.getUserPlan(req, res)
  );
  // Sign up to plan
  app.post("/api/signUpToPlan", middleware, (req, res) =>
    planFunctions.signUpToPlan(req, res)
  );
  // Sign up to plan
  app.post("/api/planPro", middleware, (req, res) =>
    planFunctions.signUpToPlanPro(req, res)
  );

  // Get proper timezone, either yours or the user you are signed in as
  app.get("/api/timezone", middleware, (req, res) =>
    userFunctions.getTimezone(req, res)
  );

  // Save writers brief
  app.post("/api/writersBrief", middleware, (req, res) =>
    writersBriefFunctions.saveWritersBrief(req, res)
  );
  // Get all placeholder blogs in writers brief
  app.post("/api/blogsInBriefs", middleware, (req, res) =>
    writersBriefFunctions.getBlogsInBriefs(req, res)
  );
  // Get all placeholder newsletters in writers brief
  app.post("/api/newslettersInBriefs", middleware, (req, res) =>
    writersBriefFunctions.getNewslettersInBriefs(req, res)
  );
  // Get all writers briefs
  app.get("/api/writersBriefs", middleware, (req, res) =>
    writersBriefFunctions.getWritersBriefs(req, res)
  );

  // Send email
  app.post("/api/email/reset", (req, res) =>
    SendMailFunctions.sendPasswordReset(req, res)
  );
  // Admin routes!!!!!

  // Get all users
  app.get("/api/users", middleware, (req, res) =>
    adminFunctions.getUsers(req, res)
  );
  // Admin update user
  app.post("/api/updateUser", middleware, (req, res) =>
    adminFunctions.updateUser(req, res)
  );
  // Get clients
  app.get("/api/clients", middleware, (req, res) =>
    adminFunctions.getClients(req, res)
  );
  // Sign in as user
  app.post("/api/signInAsUser", middleware, (req, res) =>
    adminFunctions.signInAsUser(req, res)
  );
  // Sign out as user
  app.get("/api/signOutOfUserAccount", middleware, (req, res) =>
    adminFunctions.signOutOfUserAccount(req, res)
  );
  // Create a plan
  app.post("/api/plan", middleware, (req, res) =>
    adminFunctions.createPlan(req, res)
  );
  // Get plans
  app.get("/api/plans", middleware, (req, res) =>
    adminFunctions.getPlans(req, res)
  );

  app.get("/api/analytics", middleware, (req, res) =>
    analyticsFunctions.getAllAnalytics(req, res)
  );
};
