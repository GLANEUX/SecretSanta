const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let groupSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Group', groupSchema);

// # GROUPS
// * `user_id`: required, string
// * `name`: required, string
