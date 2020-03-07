'use strict';
const express = require('express');
const router = express.Router();
const {Game, Cards} = require('../models');

function translateEffects(hand) {
  let viewHand = [];
  hand.forEach((card) => {
    viewHand.push({
      effect: Cards[card.effect],
      effectAmount: card.effectAmount
    });
  });
  return viewHand;
}

router.get('/monster/:player', async (req, res) => {
  if(!req.params.player) {
    return status(400).json({
      error: "Player's nickname is required."
    })
  }

  try {
    let game = await Game.findOne({playerName: req.params.player}).populate('state.monster');
    if(!game) {
      return res.status(400).json({
        error: "Wrong game."
      })
    }
    let monsterState = {
      hp: game.state.monster.hp,
      shield: game.state.monster.shield
    }
    return res.status(200).json({
      monsterState
    })
  }   catch(error) {
      console.error(`[STATE] GET /monster error: ${error.message}`);
      return res.status(500).json({
        code: 'internal_error',
        message: 'Internal error'
      });
    }
})

router.get('/player/:player', async (req, res) => {
  if(!req.params.player) {
    return status(400).json({
      error: "Player's nickname is required."
    })
  }

  try {
    let game = await Game.findOne({playerName: req.params.player}).populate('state.player');
    if(!game) {
      return res.status(400).json({
        error: "Wrong game."
      })
    }
    let playerState = {
      hp: game.state.player.hp,
      shield: game.state.player.shield
    }
    return res.status(200).json({
      playerState
    })
  }   catch(error) {
      console.error(`[STATE] GET /monster error: ${error.message}`);
      return res.status(500).json({
        code: 'internal_error',
        message: 'Internal error'
      });
    }

})


router.get('/playerCards/:player', async (req, res) => {
  if(!req.params.player) {
    return status(400).json({
      error: "Player's nickname is required."
    })
  }

  if(!game) {
    return res.status(400).json({
      error: "Wrong game."
    })
  }

  try {
    let game = await Game.findOne({playerName: req.params.player}).populate('state.player');;
    let playerCards = game.state.player.cards;
    return res.status(200).json({
      playerCards
    })
  }   catch(error) {
      console.error(`[STATE] GET /monster error: ${error.message}`);
      return res.status(500).json({
        code: 'internal_error',
        message: 'Internal error'
      });
    }

})

module.exports = router
