const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//User Schema
const UserSchema = new Schema ({
    name: {
        type: String,
        requried: true
    },
    date_created: {
        type: Date,
        default: Date.now
    }

})
