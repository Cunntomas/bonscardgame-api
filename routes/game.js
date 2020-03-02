'use strict';
const express = require('express');
const router = express.Router();
const {Game, Entity} = require('../models');

router.post('/new-game', async (req,res) => {
  if(!req.body.player) {
    return status(400).json({
      error: "Player's nickname is required."
    })
  }
  let player = req.body.player;

  let entity = new Entity({
    type: 'monster',
    hand: {
      cards: [
        { type: 'heal' }
      ]
    }
  });

  try {
    entity = await entity.save();
    let game = new Game({
      player,
      state: {entity: entity._id}
    });
    game = await game.save();
    
    return res.status(200).json({
      message: 'Game created successfully!',
      entity,
      game
    })
  }

  catch(error) {
    console.error(`[ALERTAS] POST /alerts error: ${error.message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
});

router.post('/next-turn', (req,res) => {

})

module.exports = router;
