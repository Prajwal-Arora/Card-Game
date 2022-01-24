const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({

    user: { type: String, required: true, trim: true },

    played: { type: Number, required: true, trim: true },

    wins: { type: Number, required: true, trim: true },

    losses: { type: Number, required: true, trim: true }

});

var User = mongoose.model('User', UserSchema);
module.exports = User;