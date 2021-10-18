const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BattleSchema = new Schema({
    player1: { type: String, required: true, trim: true },
    xVempLockedPlayer1: { type: String, required: true, trim: true },
    player2: { type: String, required: true, trim: true },
    xVempLockedPlayer2: { type: String, required: true, trim: true },
    risk: { type: String, required: true, trim: true }
}, { timestamps: true });

var Battle = mongoose.model('Battle', BattleSchema);
module.exports = Battle;