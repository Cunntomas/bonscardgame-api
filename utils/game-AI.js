'use strict';
const {Cards} = require('../models');

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

function horrorEffect(defender) {
  defender.losesTurn = true;
  return defender;
}


function calculateEffects(attacker, playedCard, defender) {
  if (Cards[playedCard.effect] === 'heal') healEffect(attacker, playedCard);
  if (Cards[playedCard.effect] === 'shield') shieldEffect(attacker, playedCard);
  if (Cards[playedCard.effect] === 'damage') damageEffect(defender, playedCard);
  if (Cards[playedCard.effect] === 'horror') horrorEffect(defender);

  return {attacker, defender};
}

function pickAvailableCard(hand) {
  return hand[Math.floor(Math.random() * hand.length)];
}

module.exports = {
  calculateEffects,
  pickAvailableCard
};
