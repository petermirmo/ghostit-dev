const express = require("express");
const app = express();
const mongoose = require("mongoose"); // Connect to mongo
const passport = require("passport"); // For Login and Register
const keys = require("./config/keys");
const bodyParser = require("body-parser"); // Needer for auth to read frontend cookies
const morgan = require("morgan"); // Every request is console logged
const session = require("express-session"); // Create sessions in backend
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session); // Store sessions in mongo securely
const User = require("./models/User");
const secure = require("express-force-https"); // force https so http does not work
const path = require("path");
const fs = require("fs");

const { getMetaInformation } = require("./functions/meta");

var allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(allowCrossDomain);

// Socket imports
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const SocketManager = require("./sockets/SocketManager");
var passportSocketIo = require("passport.socketio");

// Image uploads
const cloudinary = require("cloudinary");
// Connect to cloudinary
cloudinary.config({
  cloud_name: keys.cloudinaryName,
  api_key: keys.cloudinaryApiKey,
  api_secret: keys.cloudinaryApiSecret
});

// Schedulers
const PostScheduler = require("./scheduler/Post");
const TokenScheduler = require("./scheduler/Token");
const EmailScheduler = require("./scheduler/Email");
const PageAnalyticsScheduler = require("./scheduler/PageAnalytics");
const PostAnalyticsScheduler = require("./scheduler/PostAnalytics");
const schedule = require("node-schedule");

schedule.scheduleJob("0 0 * * 0", () => {
  TokenScheduler.main();
});

schedule.scheduleJob("* * * * *", () => {
  return;
  console.log("starting");
  PostAnalyticsScheduler.main();
});
if (process.env.NODE_ENV !== "production") {
  schedule.scheduleJob("* * * * *", () => {
    return;
    console.log("starting");
    PageAnalyticsScheduler.main();
  });
}

if (process.env.NODE_ENV === "production") {
  schedule.scheduleJob("0 0 * * *", () => {
    PageAnalyticsScheduler.main();
  });

  schedule.scheduleJob("* * * * *", () => {
    PostScheduler.main();
  });

  schedule.scheduleJob("* * * * *", () => {
    EmailScheduler.main();
  });
}

// Connect to database
mongoose.connect(keys.mongoDevelopmentURI, {
  useNewUrlParser: true,
  useCreateIndex: true
});
var db = mongoose.connection;

require("./services/passport")(passport);

app.use(morgan("dev")); // Prints all routes used to console
app.use(cookieParser()); // Read cookies (needed for auth)

app.use(bodyParser.json({ limit: "50mb" })); //Read data from html forms
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

var sessionStore = new MongoStore({ mongooseConnection: db });

app.use(
  session({
    key: "connect.sid",
    secret: keys.cookieKey,
    resave: true,
    saveUninitialized: true,
    store: sessionStore
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Force https
app.use(secure);
// Routes
require("./apiRoutes")(app);

// If using production then if a route is not found in express we send user to react routes
if (process.env.NODE_ENV === "production") {
  const injectMetaData = (req, res) => {
    const filePath = path.resolve(__dirname, "./client", "build", "index.html");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return console.log(err);
      }

      getMetaInformation(req.originalUrl, metaObj => {
        const { metaDescription, metaImage, metaTitle } = metaObj;

        data = data.replace(/\$OG_TITLE/g, metaTitle);
        data = data.replace(/\$OG_DESCRIPTION/g, metaDescription);
        data = data.replace(/\$OG_IMAGE/g, metaImage);

        res.send(data);
      });
    });
  };

  app.get("/", (req, res) => {
    injectMetaData(req, res);
  });
  app.use(express.static(path.resolve(__dirname, "./client", "build")));

  app.get("*", (req, res) => {
    injectMetaData(req, res);
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT);

io.use(
  passportSocketIo.authorize({
    passport,
    cookieParser,
    key: "connect.sid",
    secret: keys.cookieKey,
    store: sessionStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
  })
);

function onAuthorizeSuccess(data, accept) {
  accept();
}

function onAuthorizeFail(data, message, error, accept) {
  console.log("failed connection to socket.io:", data, message);
  if (error) accept(new Error(message));
}

io.on("connection", SocketManager(io));
