const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("./config/keys");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);

var Schema = mongoose.Schema;
var multer = require("multer");

// Image uploads
var cloudinary = require("cloudinary");
// Connect to cloudinary
cloudinary.config({
    cloud_name: keys.cloudinaryName,
    api_key: keys.cloudinaryApiKey,
    api_secret: keys.cloudinaryApiSecret
});

const router = express.Router();
console.log("check");
// Post scheduler
var schedulerMain = require("./scheduler/cronScheduler");
var cron = require("node-cron");
cron.schedule("1,10,20,30,40,50 * * * * *", function() {
    schedulerMain.main();
});

require("./models/User");

// Connect to database
mongoose.connect(keys.mongoDevelopentURI);
var db = mongoose.connection;

require("./services/passport")(passport);

app.use(morgan("dev")); // Prints all routes used to console
app.use(cookieParser()); // Read cookies (needed for auth)

app.use(bodyParser.json()); //Read data from html forms
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use(flash());

// Routes
require("./routes/apiRoutes")(app);

// If using production then if a route is not found in express we send user to react routes
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
