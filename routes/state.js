'use strict';
const express = require('express');
const router = express.Router();
const {Game, Cards} = require('../models');
const {translateEffects} = require('../utils/cards-generator');

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

router.get('/gamestate/:player', async (req, res) => {
  if(!req.params.player) {
    return status(400).json({
      error: "Player's nickname is required."
    })
  }

  try{
    let game = await Game.findOne({playerName: req.params.player}).populate('state.player state.monster');
    if(!game) {
      return res.status(400).json({
        error: "Wrong game."
      })
    }

    let cards = translateEffects(game.state.player.cards);

    let state = {
      turns: game.state.turnsLeft,
      player: {
        hp: game.state.player.hp,
        shield: game.state.player.shield,
        cards,
        skipsTurn: game.state.player.losesTurn,
        played: game.state.player.lastCardPlayed || null
      },
      monster: {
        hp: game.state.monster.hp,
        shield: game.state.monster.shield,
        played: game.state.monster.lastCardPlayed || null
      },
      finished: game.finished,
      result: game.result || null
    }


    return res.status(200).json({
      state:  state,
      finished: game.finished,
      result: game.result || null
    })
  } catch(error) {
    console.error(`[STATE] GET /monster error: ${error.message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }

});


router.get('/playerCards/:player', async (req, res) => {
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
