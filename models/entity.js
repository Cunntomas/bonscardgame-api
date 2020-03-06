'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntitySchema = new Schema({
  type: {
    type: String,
    enum: ['player', 'monster']
  },
  hp: {
    type: Number,
    default: 20
  },
  shield:Number,
  cards: [{
    effect: Number,
    effectAmount: Number,
    looseTurn: Boolean
  }]
});

module.exports = mongoose.model('Entity', EntitySchema);
