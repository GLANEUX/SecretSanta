//groupModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Group model
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

// Create and export the Group model based on the schema
module.exports = mongoose.model('Group', groupSchema);
