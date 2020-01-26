var User = require('../models/user');
var mongoose = require('mongoose');

exports.profile_user_get = function (req, res) {
    console.log(req.params.id);
    var id = new mongoose.Types.ObjectId(req.params.id);
    User.find({_id: id})
        .then(user => console.log('found user: ', user))
        .catch(err => res.status(400).json('error: ' + err))
};

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



