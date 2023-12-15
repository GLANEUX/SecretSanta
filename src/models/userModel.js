const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Email = require('mongoose-type-email');


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

module.exports = mongoose.model('User', userSchema);
