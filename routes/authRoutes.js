const passport = require("passport");

module.exports = app => {
    app.get("/api/logout", (req, res) => {
        req.logout();
        res.send(req.user);
    });

    app.get("/api/current_user", (req, res) => {
        res.send(req.user);
    });

    app.post(
        "/api/auth/email/register",
        passport.authenticate("local-signup", {
            successRedirect: "/content",
            failureRedirect: "/",
            failureFlash: true
        })
    );

    app.post(
        "/api/auth/login",
        passport.authenticate("local-login", {
            successRedirect: "/content",
            failureRedirect: "/",
            failureFlash: true
        })
    );
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.redirect("/");
}
