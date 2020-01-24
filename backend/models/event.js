var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var eventSchema = new Schema({
        name: {
            type: String,
            require: true
        },
        start_date: {type: Date, required: true},
        end_date: {type: Date, required: true},
        location: {type: String},
        sign_ups: [{type: Schema.Types.ObjectID, ref: 'User'}]
    }
);

eventSchema
    .virtual('start_date_formatted')
    .get(function () {
        return moment(this.start_date).format('MMMM Do, YYYY');
    });

eventSchema
    .virtual('end_date_formatted')
    .get(function () {
        return moment(this.end_date).format('MMMM Do, YYYY');
    });

module.exports = mongoose.model('Event', eventSchema);