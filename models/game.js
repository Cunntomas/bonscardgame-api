'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  playerName: {
    type: String,
    unique: true,
    required: true
  },
  state: {
    monster: {
      type: Schema.ObjectId,
      ref: 'Entity'
    },
    player: {
      type: Schema.ObjectId,
      ref: 'Entity'
    },
    turnsLeft : {
      type: Number,
      default: 12
    }
  },
  finished: Boolean,
  result: {
    type: String,
    default: 'En juego'
  }
});

module.exports = mongoose.model('Game', GameSchema);
