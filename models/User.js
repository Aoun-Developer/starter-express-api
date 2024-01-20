const mongoose_my = require('mongoose');
const { Schema } = mongoose_my;

const UserSchema_my = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const user_my = mongoose_my.model("users", UserSchema_my);
module.exports = user_my;
