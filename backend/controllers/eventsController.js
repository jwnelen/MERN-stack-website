var Event = require('../models/event');
var User = require('../models/user.js');
var async = require('async');

exports.index = function (req, res, next) {
    Event.find()
        .exec(function (err, list_event) {
            if (err) {
                return next(err);
            }
            res.render('events_list', {title: 'Events', events_list: list_event});
        });
};

exports.events_detail = function (req, res, next) {
    async.parallel({
        event_: function (callback) {
            Event.findById(req.params.id, callback)
        },
    }, function (err, results) {
        if (err) {
            next(err)
        }
        console.log(results.event_);
        console.log(results.event_.sign_ups[0]);
        res.render('event_detail', {eventItem: results.event_, amount_sign_ups: results.event_.sign_ups.length});
    });
};

exports.event_register_post = function (req, res, next) {
    // User is not signed in yet
    // sign_ups
    if (res.locals.currentUser) {
        User.findById(res.locals.currentUser)
            .exec(function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    Event.findByIdAndUpdate(
                        req.params.id,
                        {$push: {"sign_ups": user}},
                        {safe: true, upsert: true, new: true},
                        function (error, succes) {
                            if (error) {
                                console.log(error);
                            } else {
                                res.redirect('/events/' + req.params.id);
                            }
                        });
                }
            );
    } else {
        res.redirect('/login');
    }
};

