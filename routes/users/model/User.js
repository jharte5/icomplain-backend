const mongoose = require('mongoose');
const moment = require('moment')
const now = moment()

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: 'username is required',
        unique: 'Username already exists, please choose another one'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@..+/, 'Please input a valid email address'],
        required: 'Email is required'
    },
    password: {
        type: String,
        required: 'password is required'
    },
    profile: {
        name: {type: String, default:''},
        picture: {type:String, default:''}
    },
    userCreated: {
        type:String,
        default: now.format('dddd, MMMM Do YYYY, hh:mm a')
    },
    blogs: [{type: mongoose.Schema.ObjectId, ref:'Blog' }],
});

module.exports = mongoose.model('User', UserSchema)