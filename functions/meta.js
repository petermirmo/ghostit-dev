const GhostitBlog = require("../models/GhostitBlog");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const getMetaInformation = (url, callback) => {
  const defaultMetaDescription =
    "Organize your marketing process with an all-in-one marketing solution & agency for unified content development & promotion.";
  const defaultMetaImage =
    "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png";
  const defaultMetaTitle = "Ghostit Marketing Solution and Agency";
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
            "Organize your marketing process with an all-in-one marketing solution & agency for unified content development & promotion.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Ghostit Marketing Solution and Agency"
        });
      case "/pricing":
        return callback({
          metaDescription:
            "Check out pricing for Ghostit marketing plans that all include dedicated content creators, competitive analysis, keyword research, and much more.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "All-in-One Marketing Solution & Agency Pricing | Ghostit"
        });
      case "/team":
        return callback({
          metaDescription:
            "Bring your marketing concept to life with Ghostit’s team of content creators. From content development to SEO services, we can do it all.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Content Creation Team | Ghostit"
        });
      case "/blog":
        return callback({
          metaDescription:
            "Ghostit’s marketing blog shares insights into all facets of marketing including social media marketing, content marketing, and marketing automation.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Ghostit Blog | Sharing the Importance of Marketing"
        });
      case "/agency":
        return callback({
          metaDescription:
            "Our marketing agency focuses on one thing: increasing qualified traffic to your site. Find out how our team can simplify your marketing process.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Content Creation Marketing Agency | Ghostit"
        });
      case "/sign-in":
        return callback({
          metaDescription:
            "Sign in to the Ghostit platform to access your content calendar, campaigns, and templates.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Sign In to Ghostit"
        });
      case "/sign-up":
        return callback({
          metaDescription:
            "Ready to simplify your marketing process? Sign up to Ghostit’s all-in-one marketing solution and put a voice to your marketing concept today.",
          metaImage:
            "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png",
          metaTitle: "Sign Up to Ghostit"
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
