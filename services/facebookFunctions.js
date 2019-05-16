const User = require("../models/User");
const Account = require("../models/Account");
const FB = require("fb");
const generalFunctions = require("./generalFunctions");
const adsSdk = require("facebook-nodejs-business-sdk");
const keys = require("../config/keys");

module.exports = {
  getFacebookGroups: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    // Get facebook profile
    Account.findOne(
      {
        userID: userID,
        socialType: "facebook",
        accountType: "profile"
      },
      function(err, account) {
        if (err) return handleError(err);
        if (account) {
          // Use facebook profile access token to get account groups
          FB.setAccessToken(account.accessToken);

          FB.api("me/groups", "get", function(results) {
            let groups = results.data;

            // Init some values
            for (let index in groups) {
              groups[index].accountType = "group";
              groups[index].socialType = "facebook";
              groups[index].access_token = account.accessToken;
            }
            res.send({ groups });
          });
        } else
          generalFunctions.handleError(res, "Connect Facebook profile first!");
      }
    );
  },
  getFacebookPages: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    // Get facebook profile
    Account.findOne(
      {
        userID: userID,
        socialType: "facebook",
        accountType: "profile"
      },
      (err, account) => {
        if (err) generalFunctions.handleError(res, err);
        else if (account) {
          // Use facebook profile access token to get account pages
          FB.setAccessToken(account.accessToken);

          FB.api("me/accounts", "get", results => {
            let pages = results.data;
            // Init some values
            for (let index in pages) {
              pages[index].accountType = "page";
              pages[index].socialType = "facebook";
            }
            res.send({ success: true, pages });
          });
        } else
          generalFunctions.handleError(res, "Connect Facebook profile first!");
      }
    );
  },
  getInstagramPages: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Account.findOne(
      { userID, socialType: "facebook", accountType: "profile" },
      (err, account) => {
        if (err || !account) {
          res.send({
            errorMessage:
              "Connect your Facebook profile first! Facebook authorizes access to Instagram."
          });
        } else {
          FB.setAccessToken(account.accessToken);
          FB.api("me/accounts", "get", results => {
            let facebookPages = results.data;

            if (facebookPages) {
              let pages = [];
              let asyncCounter = 0;
              // Each page the user is an admin of can have a connect Instagram account
              for (let index in facebookPages) {
                const foundFacebookPage = facebookPages[index];
                const accessToken = foundFacebookPage.access_token;

                FB.setAccessToken(accessToken);

                asyncCounter++;
                FB.api(
                  foundFacebookPage.id + "?fields=instagram_business_account",
                  "get",
                  response => {
                    if (response.instagram_business_account) {
                      let instagramObject = response.instagram_business_account;

                      asyncCounter++;

                      FB.api(
                        instagramObject.id + "?fields=username",
                        "get",
                        response2 => {
                          response2.access_token = accessToken;

                          pages.push(response2);
                          asyncCounter--;
                          if (asyncCounter === 0)
                            res.send({
                              success: true,
                              pages
                            });
                        }
                      );
                    }

                    asyncCounter--;
                    if (asyncCounter === 0 && facebookPages.length === 0) {
                      generalFunctions.handleError(
                        res,
                        "Your Facebook page and Instagram pages are not connected."
                      );
                    }
                  }
                );
              }
            } else {
              generalFunctions.handleError(
                res,
                "Your Facebook and Instgram page must be connected to use through the an external software."
              );
            }
          });
        }
      }
    );
  },
  test: (req, res) => {
    const AdAccount = adsSdk.AdAccount;
    const Campaign = adsSdk.Campaign;
    const AdSet = adsSdk.AdSet;
    const AdCreative = adsSdk.AdCreative;
    const Ad = adsSdk.Ad;
    const AdPreview = adsSdk.AdPreview;

    let access_token =
      "EAATBO1uFsCMBADmloohUmu1DUp83Op8A7KXoGh7dQ1mDG6iWuHvqQ2pZALvmoqA4rTZAGu4DIp3c9H4XiXc506GBSIT44NUs0Kx2E2oVhciayCU1SVmt4wQvabthm5ZCFZCV9mPwLL00ruZC3UDCV20aBrtBCukNCZBjjo2ZCKStQDGq2glZCMxm2e3brM0tDmotBvPUMt9GLoFYa22jteGbJaoovpL8XEEZD";
    let ad_account_id = "act_2160561967544732";
    let app_secret = keys.fbClientSecret;
    let page_id = "1522081927838254";
    let app_id = keys.fbClientID;

    const api = adsSdk.FacebookAdsApi.init(access_token);
    const account = new AdAccount(ad_account_id);
    const showDebugingInfo = true; // Setting this to true shows more debugging info.
    if (showDebugingInfo) {
      api.setDebug(true);
    }

    let campaign;
    let campaign_id;
    let ad_set;
    let ad_set_id;
    let creative;
    let creative_id;
    let ad;
    let ad_id;
    let adpreview;
    let adpreview_id;

    const logApiCallResult = (apiCallName, data) => {
      console.log(apiCallName);
      if (showDebugingInfo) {
        console.log("Data:" + JSON.stringify(data));
      }
    };

    const fields = [];
    const params = {
      objective: "PAGE_LIKES",
      status: "PAUSED",
      buying_type: "AUCTION",
      name: "My Campaign"
    };
    campaign = new AdAccount(ad_account_id).createCampaign(fields, params);

    campaign
      .then(result => {
        logApiCallResult("campaign api call complete.", result);
        campaign_id = result.id;
        const fields = [];
        const params = {
          status: "PAUSED",
          targeting: { geo_locations: { countries: ["US"] } },
          daily_budget: "1000",
          billing_event: "IMPRESSIONS",
          bid_amount: "20",
          campaign_id: campaign_id,
          optimization_goal: "PAGE_LIKES",
          promoted_object: { page_id },
          name: "My AdSet"
        };
        return new AdAccount(ad_account_id).createAdSet(fields, params);
      })
      .then(result => {
        logApiCallResult("ad_set api call complete.", result);
        ad_set_id = result.id;
        const fields = [];
        const params = {
          body: "Like My Page",
          image_url:
            "https://res.cloudinary.com/dnc1t9z9o/image/upload/v1537215922/d20t4r9tnuujjjxnz3fg.png",
          name: "My Creative",
          object_id: page_id,
          title: "My Page Like Ad"
        };
        return new AdAccount(ad_account_id).createAdCreative(fields, params);
      })
      .then(result => {
        logApiCallResult("creative api call complete.", result);
        creative_id = result.id;
        const fields = [];
        const params = {
          status: "PAUSED",
          adset_id: ad_set_id,
          name: "My Ad",
          creative: { creative_id: creative_id }
        };
        return new AdAccount(ad_account_id).createAd(fields, params);
      })
      .then(result => {
        logApiCallResult("ad api call complete.", result);
        ad_id = result.id;
        const fields = [];
        const params = {
          ad_format: "DESKTOP_FEED_STANDARD"
        };
        return new Ad(ad_id).getPreviews(fields, params);
      })
      .then(result => {
        logApiCallResult("adpreview api call complete.", result);
        adpreview_id = result[0].id;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
