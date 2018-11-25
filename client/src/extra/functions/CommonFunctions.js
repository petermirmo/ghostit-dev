"use strict";
import moment from "moment-timezone";
import axios from "axios";

import faFacebook from "@fortawesome/fontawesome-free-brands/faFacebookSquare";
import faLinkedin from "@fortawesome/fontawesome-free-brands/faLinkedin";
import faTwitter from "@fortawesome/fontawesome-free-brands/faTwitterSquare";

export function mobileAndTabletcheck() {
  let check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
}
export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
export async function savePost(
  _id,
  content,
  dateToPostInUtcTime,
  link,
  linkImage,
  postImages,
  accountID,
  socialType,
  accountType,
  callback,
  deleteImagesArray,
  campaignID,
  instructions,
  name,
  calendarID,
  sendEmailReminder
) {
  if (deleteImagesArray) {
    if (deleteImagesArray.length !== 0) {
      await axios.post("/api/post/delete/images/" + _id, deleteImagesArray);
    }
  }

  // Get current images
  let imagesToSave = [];

  for (let i = 0; i < postImages.length; i++) {
    if (!postImages[i].url) imagesToSave.push(postImages[i].image);
  }

  // If link previews are allowed get src of active image from carousel
  let linkPreviewImage = "";
  if (linkImage) {
    linkPreviewImage = linkImage;
  }

  // Everything seems okay, save post to database!
  axios
    .post("/api/post", {
      _id,
      accountID,
      content,
      instructions,
      postingDate: dateToPostInUtcTime,
      link,
      linkImage: linkPreviewImage,
      accountType,
      socialType,
      campaignID,
      name,
      calendarID,
      sendEmailReminder
    })
    .then(res => {
      // Now we need to save images for post, Images are saved after post
      // Becuse they are handled so differently in the database
      // Text and images do not go well together
      let { post, success, loggedIn } = res.data;

      if (success) {
        if (post._id && imagesToSave.length !== 0) {
          // Make sure post actually saved
          // Now we add images

          // Images must be uploaded via forms
          let test = [];

          // Attach all images to formData
          for (let i = 0; i < imagesToSave.length; i++) {
            if (imagesToSave[i].currentTarget)
              test.push(imagesToSave[i].currentTarget.result);
            else if (imagesToSave[i].target)
              test.push(imagesToSave[i].target.result);
          }

          // Make post request for images
          axios
            .post("/api/post/images", { postID: post._id, images: test })
            .then(res => {
              callback(post);
            });
        } else {
          callback(post);
        }
      } else {
        if (loggedIn === false) this.props.history.push("/sign-in");
      }
    });
}
export function postChecks(
  postingToAccountId,
  dateToPostInUtcTime,
  link,
  currentImages,
  content,
  maxCharacters
) {
  if (content.length > maxCharacters) {
    alert("There are too many characters in this post!");
    return false;
  }
  let currentUtcDate = moment().utcOffset(0);
  // Make sure that the date is not in the past
  if (currentUtcDate > dateToPostInUtcTime) {
    alert(
      "Time travel is not yet possible! Please select a date in the future not in the past!"
    );
    return false;
  }

  if (postingToAccountId === "") {
    alert("Please select an account to post to!");
    return false;
  }

  // Check to make sure we have atleast a link, content, or an image
  if (content === "" && link === "" && currentImages === []) {
    alert(
      "You are trying to create an empty post. We will not let you shoot yourself in the foot."
    );
    return;
  }
  return true;
}
export function carouselOptions(socialType) {
  if (socialType === "facebook") {
    return [true, false];
  } else if (socialType === "twitter") {
    return [false, false];
  } else if (socialType === "linkedin") {
    return [true, true];
  } else if (socialType === "instagram") {
    return [false, false];
  } else if (socialType === "blog") {
    return [false, false];
  } else if (socialType === "newsletter") {
    return [false, false];
  }
}
export function getPostColor(socialType) {
  if (socialType === "facebook") {
    return "#4267b2";
  } else if (socialType === "twitter") {
    return "#1da1f2";
  } else if (socialType === "linkedin") {
    return "#0077b5";
  } else if (socialType === "instagram") {
    return "#cd486b";
  } else if (socialType === "blog") {
    return "#e74c3c";
  } else if (socialType === "newsletter") {
    return "#fd651c";
  } else if (socialType === "custom") {
    return "var(--seven-purple-color)";
  } else {
    return "var(--five-purple-color)";
  }
}
export function getSocialCharacters(post_type) {
  if (post_type === "twitter") {
    return 280;
  } else if (post_type === "linkedin") {
    return 700;
  } else return undefined;
}
export function getPostIcon(socialType) {
  if (socialType === "facebook") return faFacebook;
  else if (socialType === "twitter") return faTwitter;
  else if (socialType === "linkedin") return faLinkedin;
  else if (socialType === "instagram") return false;
  else return false;
}
