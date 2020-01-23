var mongoose = require('mongoose');

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

module.exports = mongoose.model('Event', eventSchema);