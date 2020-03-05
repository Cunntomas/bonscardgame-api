'use strict';
const express = require('express');
const router = express.Router();
const {Game, Entity} = require('../models');
const {initialHand, randomCard} = require('../utils/cards-generator');

router.post('/newgame', async (req,res) => {
  if(!req.body.player) {
    return status(400).json({
      error: "Player's nickname is required."
    })
  }
  let playerName = req.body.player;
  let monsterHand =  initialHand();
  let monster = new Entity({
    type: 'monster',
    hand: {
      cards: monsterHand
    },
    shield: 10
  });
  let playerHand =  initialHand();
  let player = new Entity({
    type: 'player',
    hand: {
      cards: playerHand
    },
    shield: 0
  });

  try {
    monster = await monster.save();
    player = await player.save();
    let game = new Game({
      player: playerName,
      state: {
        monster: monster.id,
        player: player.id
      }
    });
    game = await game.save();

    return res.status(200).json({
      message: 'Game created successfully!',
      monster,
      player,
      game
    })
  }

  catch(error) {
    console.error(`[GAME] POST /newgame error: ${error.message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
});

router.post('/next-turn', (req,res) => {
  if(!req.body.card) {
    return status(400).json({
      error: "Player must select a card to play"
    })
  }
  if(!req.body.player) {
    return status(400).json({
      error: "Player's nickname is required."
    })
  }
  let card = req.body.card;
  let player = req.body.player;

})

module.exports = router;
