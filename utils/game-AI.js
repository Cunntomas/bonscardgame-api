'use strict';

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
  if (playedCard.type === 'heal') healEffect(attacker, playedCard);
  if (playedCard.type === 'shield') shieldEffect(attacker, playedCard);
  if (playedCard.type === 'damage') damageEffect(defender, playedCard);
  if (playedCard.type === 'horror') return false;

  return {attacker, defender};
}

module.exports = {
  pickAvailableCard,
  calculateEffects
};
