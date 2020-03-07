'use strict';
const express = require('express');
const router = express.Router();
const { Game, Entity, Cards } = require('../models');
const { initialHand, randomCard, translateEffects } = require('../utils/cards-generator');
const { calculateEffects, pickAvailableCard } = require('../utils/game-AI');

router.post('/newgame', async (req, res) => {
  if (!req.body.player) {
    return status(400).json({
      error: "Player's nickname is required."
    })
  }

  let game = await Game.findOne({ playerName: req.body.player });
  if (game) {
    return res.status(400).json({
      error: "NickName already in use."
    })
  }
  let playerName = req.body.player;
  let monsterHand = initialHand();
  let monster = new Entity({
    type: 'monster',
    cards: monsterHand,
    shield: 10
  });

  let playerHand = initialHand();
  let player = new Entity({
    type: 'player',
    cards: playerHand,
    shield: 0
  });

  try {
    monster = await monster.save();
    player = await player.save();

    let game = new Game({
      playerName,
      state: {
        monster: monster.id,
        player: player.id
      }
    });

    game = await game.save();

    return res.status(200).json({
      message: 'Game created successfully!',
      player,
      monster,
      game
    })
  }

  catch (error) {
    console.error(`[GAME] POST /newgame error: ${error.message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }

});

router.post('/next-turn', async (req, res) => {
  if (!req.body.player) {
    return res.status(400).json({
      error: "Player's nickname is required."
    })
  }

  let game = await Game.findOne({ playerName: req.body.player }).populate('state.monster state.player');
  if (!game) {
    return res.status(400).json({
      error: "Wrong game."
    })
  }
  if (game.finished) {
    return res.status(400).json({
      error: "Game is over"
    })
  }

  let playerCard, playersCardIndex, monsterCard;
  let player = game.state.player;
  let monster = game.state.monster;

  // ==========================================================================
  // ==========================================================================
  // COMIENZA EL TURNO DEL JUGADOR
  // ==========================================================================
  // ==========================================================================
  if (!player.losesTurn && req.body.playedCard) {
    let playedCard = req.body.playedCard;
    const validPlayerCard = (card) => card._id == playedCard;
    playersCardIndex = player.cards.findIndex(validPlayerCard);

    if (playerCard === -1) {
      return res.status(400).json({
        error: "Wrong card."
      })
    }

    let newPlayerTurnState = calculateEffects(player, player.cards[playersCardIndex], monster);
    player = newPlayerTurnState.attacker;
    monster = newPlayerTurnState.defender;
    playerCard = player.cards[playersCardIndex];
    let playerDrawCard = randomCard();
    player.cards.splice(playersCardIndex, 1);
    player.cards.push(playerDrawCard);
  }
  // ==========================================================================
  // ==========================================================================
  // TERMINA EL TURNO DEL JUGADOR
  // COMIENZA EL TURNO DEL MOUNSTRUO
  // ==========================================================================
  // ==========================================================================
  if (!monster.losesTurn) {
    monsterCard = pickAvailableCard(monster.cards);
    const validMonsterCard = (card) => card._id == monsterCard._id;
    let cardIndex = monster.cards.findIndex(validMonsterCard);

    let newMonsterTurnState = calculateEffects(monster, monsterCard, player);

    monster = newMonsterTurnState.attacker;
    player = newMonsterTurnState.defender;
    monster.cards.splice(cardIndex, 1);
    let monsterDrawCard = randomCard();
    monster.cards.push(monsterDrawCard);
  }

  if (!monsterCard || monsterCard.effect !== 4) {
    player.losesTurn = false
  }

  if (!playerCard || playerCard.effect !== 4) {
    monster.losesTurn = false
  }

  let cards = translateEffects(game.state.player.cards);
  let monsterPlayed, playerPlayed;
  if(playerCard) {
    playerPlayed = {
      effect: Cards[playerCard.effect],
      effectAmount: playerCard.effectAmount
    };
    player.lastCardPlayed = playerPlayed;
  }

  if(monsterCard) {
    monsterPlayed = {
      effect: Cards[monsterCard.effect],
      effectAmount: monsterCard.effectAmount
    };
    monster.lastCardPlayed = monsterPlayed;
  }

  await player.save();
  await monster.save();

  if (monster.hp < 1) {
    game.finished = true;
    game.result = 'Player won';
  }

  if (player.hp < 1) {
    game.finished = true;
    game.result = 'Player died';
  }

  game.state.turnsLeft -= 1;

  if (game.state.turnsLeft === 0) {
    game.finished = true;
    game.result = 'Player ran out of turns';
  }

  game = await game.save();




  let state = {
    turns: game.state.turnsLeft,
    player: {
      hp: game.state.player.hp,
      shield: game.state.player.shield,
      cards,
      skipsTurn: game.state.player.losesTurn,
      played: game.state.player.lastCardPlayed
    },
    monster: {
      hp: game.state.monster.hp,
      shield: game.state.monster.shield,
      played: game.state.monster.lastCardPlayed
    },
    finished: game.finished,
    result: game.result || null
  }

  return res.status(200).json({
    state
  });
})



module.exports = router;
