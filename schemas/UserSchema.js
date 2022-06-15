const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({

    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    played: { type: Number, required: true, trim: true },
    wins: { type: Number, required: true, trim: true },
    losses: { type: Number, required: true, trim: true }

});

var User = mongoose.model('User', UserSchema);
module.exports = User;
