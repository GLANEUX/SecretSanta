const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let groupSchema = new Schema({
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
        required: true
    }
});

module.exports = mongoose.model('Group', groupSchema);



// # MEMBERS
// * `group_id`: required, string
// * `user_id`: required, string
// * `santa_id`: string
