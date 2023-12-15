const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let memberSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    group_id: {
        type: String,
        required: true
    },
    santa_id: {
        type: String,
    },
    accept: {
        type: Boolean,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Member', memberSchema);


