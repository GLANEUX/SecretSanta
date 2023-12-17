//userModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Email = require('mongoose-type-email');

// Define the schema for the User model
let userSchema = new Schema({
    email: {
        type: Email,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    invited: {
        type: String,
        required: true
    },
});

// Create and export the User model based on the schema
module.exports = mongoose.model('User', userSchema);
