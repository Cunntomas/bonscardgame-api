'use strict';
const express = require('express');
const router = express.Router();
const {Game, Entity} = require('../models');
const {initialHand, randomCard} = require('../utils/cards-generator');
const {calculateEffects, pickAvailableCard} = require('../utils/game-AI');

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
  if(game.finished) {
    return res.status(400).json({
      error: "Game is over"
    })
  }
  if(game.state.turnsLeft === 0) {
    return res.status(200).json({
      message: 'You run out of turns. Game over!'
    })
  }
  let playerCard, monsterCard;
  let playedCard = req.body.playedCard;
  let player = game.state.player;
  let monster = game.state.monster;

  if(!player.losesTurn) {
    const validPlayerCard = (card) => card._id == playedCard;
    playerCard = player.cards.findIndex(validPlayerCard);

    if(playerCard === -1) {
      return res.status(400).json({
        error: "Wrong card."
      })
    }

    let newPlayerTurnState = calculateEffects(player, player.cards[playerCard], monster);
    player = newPlayerTurnState.attacker;
    monster = newPlayerTurnState.defender;

    let playerDrawCard = randomCard();
    player.cards.splice(playerCard,1);
    player.cards.push(playerDrawCard);
  }
  // ==========================================================================
  // ==========================================================================
  // TERMINA EL TURNO DEL JUGADOR
  // COMIENZA EL TURNO DEL MOUNSTRUO
  // FALTA IMPLEMENTAR LOGICA DE SALTO DE TURNO
  // ==========================================================================
  // ==========================================================================
  if(!monster.losesTurn) {
    monsterCard = pickAvailableCard(monster.cards);
    const validMonsterCard = (card) => card._id == monsterCard._id;
    let cardIndex = monster.cards.findIndex(validMonsterCard);

    let newMonsterTurnState = calculateEffects(monster, monsterCard, player);
    console.log(monsterCard);

    monster = newMonsterTurnState.attacker;
    player= newMonsterTurnState.defender;
    monster.cards.splice(cardIndex,1);
    let monsterDrawCard = randomCard();
    monster.cards.push(monsterDrawCard);
  }

  if(!monsterCard || monsterCard.effect !== 4) {
    console.log('player dont loses turn');
    player.losesTurn = false
  }

  if(!playerCard || playerCard.effect !== 4) {
    console.log('monster dont loses turn');
    monster.losesTurn = false
  }

  await player.save();
  await monster.save();

  if(monster.hp < 1) {
    game.finished = true;
    game.result = 'Player won';
    return res.status(200).json({message:'You won! The monster is dead!'});
  }

  if(player.hp < 1) {
    game.finished = true;
    game.result = 'Player Lost';
    return res.status(200).json({message:'You died! Game over!'});
  }

  game.state.turnsLeft -= 1;
  await game.save();
  console.log(game.state.turnsLeft);
  return res.status(200).json({true:true});
})



module.exports = router;
