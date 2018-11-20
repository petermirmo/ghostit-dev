const Post = require("../models/Post");
const keys = require("../config/keys");
const Account = require("../models/Account");

const { savePostError, savePostSuccessfully } = require("./functions");

var Twitter = require("twitter");
var request = require("request").defaults({ encoding: null });

module.exports = {
  postToProfile: post => {
    Account.findOne(
      {
        userID: post.userID,
        socialID: post.accountID
      },
      async (err, account) => {
        // Initialize client
        var client = new Twitter({
          consumer_key: keys.twitterConsumerKey,
          consumer_secret: keys.twitterConsumerSecret,
          access_token_key: account.accessToken,
          access_token_secret: account.tokenSecret
        });

        // Check if this post has images in it
        if (post.images.length !== 0) {
          uploadImage("", 0, client, post);
        } else {
          // If no pictures then just post normally
          postToTwitter(client, { status: post.content }, post._id);
        }
      }
    );
  }
};
function uploadImage(mediaListID, i, client, post) {
  // If this post has images we have a recursive function to add each photo
  // and store the media_id in the mediaListID string
  if (post.images[i]) {
    // Download image from url
    request.get(post.images[i].url, (err, res, body) => {
      // Upload image to Twitter
      client.post("media/upload", { media: body }, (error, media, response) => {
        if (error || media.media_id === undefined) {
          functions.savePostError(post._id, error);
        } else {
          mediaListID += "," + media.media_id_string;
          uploadImage(mediaListID, i + 1, client, post);
        }
      });
    });
  } else {
    // If there are no more images to upload then post to Twitter
    mediaListID = mediaListID.slice(1, mediaListID.length);
    postToTwitter(
      client,
      { status: post.content, media_ids: mediaListID },
      post._id
    );
  }
}
function postToTwitter(client, twitterPost, postID) {
  client.post("statuses/update", twitterPost, (error, tweet, response) => {
    if (error || tweet.id === undefined) {
      functions.savePostError(postID, error);
    } else {
      functions.savePostSuccessfully(postID, tweet.id);
    }
  });
}
