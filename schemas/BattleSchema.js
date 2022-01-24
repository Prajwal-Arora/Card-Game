const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BattleSchema = new Schema({

    uid: { type: String, required: true, trim: true },

    winner: { type: String, trim: true },

    claimed: { type: Boolean, default: false },

    dataSentToContract: { type: Boolean, default: false }

});

var Battle = mongoose.model('Battle', BattleSchema);
module.exports = Battle;