import React, { useState } from 'react';
import styled from 'styled-components';

import Table from './Table';

const StartButton = styled.button`
  width: 6rem;
  height: 3rem;
  background: #232323;
  color: #FEFEFE;
  border-radius: 0.5rem;
  font-size: 1.5rem;

  &:hover {
    scale: 1.1;
  }
`;

// Card = {number: ..., type: ... backwards: ...};
// playerCoins = {black: ..., darkblue: ..., darkgreen: ..., darkred: ...};
// playerCards = [Card1, Card2];
// playerHand = {playerCoins, playerCards};

let cardTypes = ['club', 'heart', 'diamond', 'spade'];
let cardNumbers = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

let baseCoins = {
  black: 2,
  darkblue: 4,
  darkgreen: 6,
  darkred: 8,
};

let coinValues = {
  black: 100,
  darkblue: 50,
  darkgreen: 20,
  darkred: 10,
};

let coinTypes = ['black', 'darkblue', 'darkgreen', 'darkred'];

/**
 *
 * @returns Component that manages the Game
 */
export default function Game() {
  let [cardStack, setCardStack] = useState(shuffleCardStack(getFreshCardStack()));
  let [cardRiver, setCardRiver] = useState([]);
  let [coinStack, setCoinStack] = useState({ black: 0, darkblue: 0, darkgreen: 0, darkred: 0 });

  let [player1, setPlayer1] = useState(getFreshPlayerHand());
  let [player2, setPlayer2] = useState(getFreshPlayerHand());
  let [player3, setPlayer3] = useState(getFreshPlayerHand());
  let [player4, setPlayer4] = useState(getFreshPlayerHand());

  console.log(cardStack.length);

  return (
    <>
      <Table
        cardStack={cardStack}
        cardRiver={cardRiver}
        coinStack={coinStack}
        players={[player1, player2, player3, player4]}
      />
      <StartButton onClick={() => startNewRound()}>Start</StartButton>
    </>
  );

  function startNewRound() {
    let currentCardStack = [...cardStack];
    let currentCardRiver = [...cardRiver];

    drawPlayerCards(currentCardStack);
    drawRiverCards(3, currentCardRiver, currentCardStack);
    flipRiverCards(currentCardRiver, false);

    setCardStack(currentCardStack);
    setCardRiver(currentCardRiver);
  }

  function drawPlayerCards(currentCardStack) {
    function drawPlayer({ player, setPlayer }) {
      let currentPlayer = { ...player };
      let { playerCoins, playerHand } = currentPlayer;
      playerHand.push(currentCardStack.pop());
      playerHand.push(currentCardStack.pop());
      setPlayer({ playerCoins, playerHand });
    }

    let playerTuples = [
      { player: player1, setPlayer: setPlayer1 },
      { player: player2, setPlayer: setPlayer2 },
      { player: player3, setPlayer: setPlayer3 },
      { player: player4, setPlayer: setPlayer4 },
    ];

    for (let playerTuple of playerTuples) {
      drawPlayer(playerTuple);
    }
  }

  function drawRiverCards(amount, currentCardRiver, currentCardStack) {
    for (let i = 0; i < amount; i++) {
      currentCardRiver.push(currentCardStack.pop());
    }
  }

  function flipRiverCards(currentCardRiver, backwards) {
    for(let card of currentCardRiver) {
        card.backwards = backwards
    }
  }
}

function getFreshCardStack() {
  let cards = [];

  for (let type of cardTypes) {
    for (let number of cardNumbers) {
      cards.push({ number, type, backwards: true });
    }
  }

  return cards;
}

function getFreshPlayerHand() {
  return {
    playerCoins: { ...baseCoins },
    playerHand: [],
  };
}

// Uses Knuth's Shuffle Algorithm
function shuffleCardStack(cardStack) {
  cardStack = [...cardStack]; // copy
  let currentIndex = cardStack.length;
  let randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [cardStack[currentIndex], cardStack[randomIndex]] = [cardStack[randomIndex], cardStack[currentIndex]];
  }

  return cardStack;
}
