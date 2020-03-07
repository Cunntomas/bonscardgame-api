'use strict';
const cards = require('../models/cards');

function randomCard() {
  let card = {};
  card.effect = Math.floor(Math.random() * 4) + 1;
  if(card.effect !== 4) {
    card.effectAmount = Math.floor(Math.random() * 5) + 1;
  }
  return card;
}

function initialHand() {
  let hand = [];
  let effect;
  for (let i = 1; i <= 4; i++) {
    effect = Math.floor(Math.random() * 4) + 1;
    hand.push({effect});
  }
  hand.forEach(card => {
    if(card.effect != 4) {
      card.effectAmount = Math.floor(Math.random() * 5) + 1;
    }
  })
  return hand;
}

module.exports = {
  initialHand,
  randomCard
}
