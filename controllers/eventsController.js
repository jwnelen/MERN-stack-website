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
    Event.findById(req.params.id)
        .exec(function (err, event) {
            if (err) {
                return next(err)
            }

            res.render('event_detail', {eventItem: event});
        });
};

exports.event_register_post = function (req, res, next) {
    console.log('clicked button!');
    res.send('Clicked the button');
};

