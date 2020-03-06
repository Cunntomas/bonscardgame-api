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
  let game = await Game.findOne({playerName: req.body.player});
  if(game) {
    return res.status(400).json({
      error: "NickName already in use."
    })
  }

  let playerName = req.body.player;
  let monsterHand =  initialHand();
  let monster = new Entity({
    type: 'monster',
    cards: monsterHand,
    shield: 10
  });

  let playerHand =  initialHand();
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
  if(!game) {
    return res.status(400).json({
      error: "Wrong game."
    })
  }
  if(game.state.turnsLeft === 0) {
    return res.status(200).json({
      message: 'You run out of turns. Game over!'
    })
  }

  let playedCard = req.body.playedCard;
  let player = game.state.player;
  let monster = game.state.monster;

  // for (var i = 0; i < player.cards.length; i++) {
  //   if (player.cards[i]._id == playedCard) {
  //     calculateEffects(player, player.cards[i], monster);
  //     player.cards.splice(i,1);
  //     break;
  //   } else {
  //     notFound = true;
  //   }
  // }
  const validCard = (card) => card._id == playedCard;
  let card = player.cards.findIndex(validCard);

  if(card === -1) {
    return res.status(400).json({
      error: "Wrong card."
    })
  }

  let newState = calculateEffects(player, player.cards[card], monster);
  console.log(newState);
  player = newState.attacker;
  monster = newState.defender;


  // player.cards.splice(card,1);
  // let drawCard = randomCard();
  // player.cards.push(drawCard);
  // await player.save();
  // await monster.save();


  return res.status(200).json({true:true});
})



module.exports = router;
