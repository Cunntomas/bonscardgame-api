'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  player: String,
  state: {
    turn: {
      type: String,
      enum: ['monster', 'player']
    },
    entity: {
      type: Schema.ObjectId,
      ref: 'Entity'
    }
  }
});

module.exports = mongoose.model('Game', GameSchema);
