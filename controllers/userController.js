var User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---- REGISTER    ------
exports.register_get = function(req, res, next){
    console.log("get register");
    res.render("register");
};

exports.register_post = function(req, res, next){
    console.log("register post");
    User.register(new User({username:req.body.username}),req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        } //user strategy
        passport.authenticate("local")(req, res, function(){
            console.log('goes to secret!');
            res.redirect("/secret"); //once the user sign up
        });
    });
};

// ---- LOGIN -------
exports.login_get = function(req, res, next) {
    res.render("login");
};

exports.login_post = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/users/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            console.log('secret page for: ' + user.username);
            return res.redirect('/secret');
        });
    })(req, res, next);
};



