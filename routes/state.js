'use strict';
const express = require('express');
const router = express.Router();
const {Game, Entity} = require('../models');


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

    let monsterState = game.state.monster;
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

  if(!game) {
    return res.status(400).json({
      error: "Wrong game."
    })
  }

  try {
    let game = await Game.findOne({playerName: req.params.player}).populate('player.monster');
    let playerState = game.state.player;
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
