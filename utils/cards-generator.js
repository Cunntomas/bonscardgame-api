'use strict';
const cards = {
  1: 'heal',
  2: 'shield',
  3: 'damage',
  4: 'horror'
}


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
