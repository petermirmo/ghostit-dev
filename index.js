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

var allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(allowCrossDomain);

// Socket imports
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const SocketManager = require("./sockets/SocketManager");
io.on("connection", SocketManager);

// Image uploads
const cloudinary = require("cloudinary");
// Connect to cloudinary
cloudinary.config({
  cloud_name: keys.cloudinaryName,
  api_key: keys.cloudinaryApiKey,
  api_secret: keys.cloudinaryApiSecret
});

// Schedulers
const PostScheduler = require("./scheduler/PostScheduler");
const TokenScheduler = require("./scheduler/TokenScheduler");
const EmailScheduler = require("./scheduler/EmailScheduler");
const schedule = require("node-schedule");

schedule.scheduleJob("* * * * *", () => {
  PostScheduler.main();
});

if (process.env.NODE_ENV === "production") {
  schedule.scheduleJob("0 0 * * 0", () => {
    console.log("starting");
    TokenScheduler.main();
  });
}

schedule.scheduleJob("* * * * *", () => {
  EmailScheduler.main();
});

// Connect to database
mongoose.connect(
  keys.mongoDevelopentURI,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);
var db = mongoose.connection;

require("./services/passport")(passport);

app.use(morgan("dev")); // Prints all routes used to console
app.use(cookieParser()); // Read cookies (needed for auth)

app.use(bodyParser.json({ limit: "50mb" })); //Read data from html forms
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(
  session({
    secret: keys.cookieKey,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db })
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
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT);
