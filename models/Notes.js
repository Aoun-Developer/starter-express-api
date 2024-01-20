const mongoose_my = require('mongoose');
const { Schema } = mongoose_my;

const NotesSchema_my = new Schema({
    user: {
        type: mongoose_my.Schema.Types.ObjectId,
        ref: "user_my"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose_my.model("notes", NotesSchema_my)