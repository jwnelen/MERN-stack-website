var User = require('../models/user');

// ---- REGISTER    ------
exports.profile_get = function (req, res) {
    res.render("profile");
};

exports.profile_post = function (req, res, next) {
    if (req.session) {
        //delete session object
        req.session.destroy(function (err) {
            if (err) {
                console.log('error in destroying the session');
                return next(err);
            } else {
                return res.redirect("/login");
            }
        });
    } else {
        console.log("no session available!!");
        return res.redirect('/login');
    }
};



