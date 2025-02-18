const express = require('express');
const passportlocalmongoose = require('passport-local-mongoose');

const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportlocalmongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;