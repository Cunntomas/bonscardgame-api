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
    turn: {
      type: String,
      enum: ['monster', 'player']
    },
    monster: {
      type: Schema.ObjectId,
      ref: 'Entity'
    },
    player: {
      type: Schema.ObjectId,
      ref: 'Entity'
    }
  },
  maxTurns : {
    type: Number,
    default: 12
  }
});

module.exports = mongoose.model('Game', GameSchema);
