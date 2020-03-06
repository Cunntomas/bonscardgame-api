'use strict';
const cards = require('../models/cards');

function randomCard() {
  let effect = Math.floor(Math.random() * 4) + 1;
  return cards[effect];
}

function initialHand() {
  let hand = [];
  let effect;
  for (let i = 1; i <= 4; i++) {
    effect = Math.floor(Math.random() * 4) + 1;
    hand.push({type:cards[effect]});
  }
  return hand;
}

module.exports = {
  initialHand,
  randomCard
}
