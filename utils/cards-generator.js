'use strict';
const Cards = require('../models/cards');

function translateEffects(hand) {
  let viewHand = [];
  hand.forEach((card) => {
    viewHand.push({
      effect: Cards[card.effect],
      effectAmount: card.effectAmount,
      id: card._id
    });
  });
  return viewHand;
}

function randomCard() {
  let card = {};
  card.effect = Math.floor(Math.random() * 4) + 1;
  if(card.effect !== 4) {
    if(card.effect === 3) {
      card.effectAmount = Math.floor(Math.random() * 5) + 2;
    }
    if(card.effect !== 3) {
      card.effectAmount = Math.floor(Math.random() * 3) + 1;
    }
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
    if(card.effect !== 4) {
      if(card.effect === 3) {
        card.effectAmount = Math.floor(Math.random() * 5) + 2;
      }
      if(card.effect !== 3) {
        card.effectAmount = Math.floor(Math.random() * 3) + 1;
      }
    }
  })
  return hand;
}

module.exports = {
  translateEffects,
  initialHand,
  randomCard
}
