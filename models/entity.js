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
  hand: {
    // amount: {
    //   type: Number,
    //   default: 4
    // },
    cards: [{
      type: {
        type: String,
        enum: ['heal', 'damage', 'shield', 'horror'],
      },
      effect: Number,
      looseTurn: {
        type: Boolean,
        default: false
      }
    }]
  }
});

EntitySchema.pre('save', function(next) {
  const entity = this;
  entity.hand.cards.forEach(card => {
    if(card.type === 'horror') {
      card.looseTurn == true;
    } else if (card.type != 'horror') {
      card.effect = Math.floor(Math.random() * 5) + 1;
    }
  })
  return next();
});

module.exports = mongoose.model('Entity', EntitySchema);
