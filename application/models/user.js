const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userschema = new Schema ({
    username: {
        type: String, 
        unique: true
    },
    password: String,
    recipes: []
});

module.exports = mongoose.model('User', userschema, 'users');
