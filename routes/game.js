'use strict';
const express = require('express');
const router = express.Router();
const {Game, Entity} = require('../models');
const {initialHand, randomCard} = require('../utils/cards-generator');
const {calculateEffects} = require('../utils/game-AI');

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

router.post('/next-turn', async (req,res) => {
  if(!req.body.playedCard) {
    return res.status(400).json({
      error: "Player must select a card to play"
    })
  }


  if(!req.body.player) {
    return res.status(400).json({
      error: "Player's nickname is required."
    })
  }

  let game = await Game.findOne({playerName: req.body.player}).populate('state.monster state.player');

  if(game.state.turnsLeft === 0) {
    return res.status(200).json({
      message: 'You run out of turns. Game over!'
    })
  }

  let playedCard = req.body.playedCard;

  let player = game.state.player;
  let playersHand = player.hand.cards;

  let monster = game.state.monster;
  let monstersHand = monster.hand.cards;

  let notFound = false;


  for (var i = 0; i < playersHand.length; i++) {
    if (playersHand[i]._id == playedCard) {
      calculateEffects(player, playersHand[i], monster);
      playersHand.splice(i,1);
    } else {
      let notFound = true;
    }
  }

  if(notFound) {
    return res.status(400).json({
      error: "Wrong card."
    })
  }

  return res.status(200).json({true:true});
})



module.exports = router;
