const GhostitBlog = require("../models/GhostitBlog");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const getMetaInformation = (url, callback) => {
  const defaultMetaDescription =
    "Organize your marketing process with an all-in-one solution for unified content promotion.";
  const defaultMetaImage =
    "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png";
  const defaultMetaTitle = "All In One Marketing Solution | Ghostit";
  const defaultObject = {
    metaDescription: defaultMetaDescription,
    metaImage: defaultMetaImage,
    metaTitle: defaultMetaTitle
  };
  if (url.substring(0, 6) === "/blog/") {
    GhostitBlog.find({}, (err, ghostitBlogs) => {
      for (let index in ghostitBlogs) {
        const ghostitBlog = ghostitBlogs[index];
        const { contentArray = [], images = [] } = ghostitBlog;
        if (ghostitBlog.url) {
          if (ghostitBlog.url === url.substring(6, url.length)) {
            let temp = {};
            if (contentArray[0]) temp = JSDOM.fragment(contentArray[0].html);

            let metaTitle = defaultMetaTitle;
            if (temp.firstChild) metaTitle = temp.firstChild.textContent;

            let temp2 = {};
            if (contentArray[1]) temp2 = JSDOM.fragment(contentArray[1].html);

            let metaDescription = defaultMetaDescription;
            if (temp2.firstChild)
              metaDescription = temp2.firstChild.textContent;

            let metaImage = defaultMetaImage;
            if (images[0]) metaImage = images[0].url;

            return callback({
              metaDescription,
              metaImage,
              metaTitle: metaTitle + " | Ghostit"
            });
          }
        }
      }

      return callback(defaultObject);
    });
  } else
    switch (url) {
      case "/":
        return callback({
          metaDescription:
            "Organize your marketing process with an all-in-one solution for unified content promotion.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Home | Ghostit"
        });
      case "/home":
        return callback({
          metaDescription:
            "Organize your marketing process with an all-in-one solution for unified content promotion.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Home | Ghostit"
        });
      case "/pricing":
        return callback({
          metaDescription: "Have questions? Email us at hello@ghostit.co!",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Pricing | Ghostit"
        });
      case "/team":
        return callback({
          metaDescription: "Meet the Ghostit Team!",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Team | Ghostit"
        });
      case "/blog":
        return callback({
          metaDescription: "Guides, events and all things Ghostit!",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Blog | Ghostit"
        });
      case "/agency":
        return callback({
          metaDescription:
            "Increase the amount of qualified traffic to your site!",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Agency | Ghostit"
        });
      case "/sign-in":
        return callback({
          metaDescription: "Sign in to your Ghostit account.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Sign In | Ghostit"
        });
      case "/sign-up":
        return callback({
          metaDescription: "Sign up and start using Ghostit today!",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Sign Up | Ghostit"
        });
      case "/forgot-password":
        return callback({
          metaDescription: "Forgot password.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Forgot Password | Ghostit"
        });
      case "/terms-of-service":
        return callback({
          metaDescription: "Terms of service.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Terms of Service | Ghostit"
        });
      case "/privacy-policy":
        return callback({
          metaDescription: "Privacy policy.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Privacy Policy | Ghostit"
        });
      default:
        return callback(defaultObject);
    }
};

module.exports = {
  getMetaInformation
};
