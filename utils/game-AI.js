'use strict';
const {Cards} = require('../models');

function pickAvailableCard(hand) {
  let effect = Math.floor(Math.random() * 4) + 1;
  let card = cards[effect];
  return card;
}

function healEffect(attacker, card) {
  attacker.hp += card.effectAmount;
  return attacker;
}

function shieldEffect(attacker, card) {
  attacker.shield += card.effectAmount;
}

function damageEffect(defender, card) {
  defender.shield -= card.effectAmount;
  if (defender.shield < 0) {
    defender.hp -= (defender.shield * -1);
    defender.shield = 0;
  }
  return defender;
}


function calculateEffects(attacker, playedCard, defender) {
  if (Cards[playedCard.effect] === 'heal') healEffect(attacker, playedCard);
  if (Cards[playedCard.effect] === 'shield') shieldEffect(attacker, playedCard);
  if (Cards[playedCard.effect] === 'damage') damageEffect(defender, playedCard);
  if (Cards[playedCard.effect] === 'horror') return false;

  return {attacker, defender};
}

module.exports = {
  pickAvailableCard,
  calculateEffects
};
