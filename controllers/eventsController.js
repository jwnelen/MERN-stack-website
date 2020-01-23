var Event = require('../models/event');
var User = require('../models/user.js');

var async = require('async');

exports.index = function(req, res, next) {
    Event.find()
        .exec(function (err, list_event) {
            if(err) {return next(err); }
            res.render('events', {title: 'Events', events_list: list_event});
    });
};