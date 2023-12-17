//memberModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Member model
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

// Create and export the Member model based on the schema
module.exports = mongoose.model('Member', memberSchema);

