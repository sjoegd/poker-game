import React, { useState } from 'react';
import styled from 'styled-components';

import Table from './Table';

const Button = styled.button`
  margin: 0 .25rem;
  width: 6rem;
  height: 3rem;
  background: #232323;
  color: #fefefe;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};

  &:hover {
    scale: ${({ disabled }) => (disabled ? 1 : 1.1)};
  }
`;

const StartButton = styled(Button)``
const FoldButton = styled(Button)``
const CallButton = styled(Button)``
const RaiseButton = styled(Button)``

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
  darkgreen: 10,
  darkred: 5,
};

let coinTypes = ['black', 'darkblue', 'darkgreen', 'darkred'];
// playerStates = ['waiting', 'folded', 'mustRaise']

/**
 * TODO:
 *  Make sure every functions follows the following rules:
 *  Every state accessed in in the function and called functions in that functions
 *  should be copied at the start of the function and set at the end of the function
 *  any helper functions should be given the copy of the states
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

  let [player1Bet, setPlayer1Bet] = useState(0);
  let [player2Bet, setPlayer2Bet] = useState(0);
  let [player3Bet, setPlayer3Bet] = useState(0);
  let [player4Bet, setPlayer4Bet] = useState(0);

  let [player1State, setPlayer1State] = useState('waiting');
  let [player2State, setPlayer2State] = useState('waiting');
  let [player3State, setPlayer3State] = useState('waiting');
  let [player4State, setPlayer4State] = useState('waiting');

  let playerIDs = {
    0: { player: player1, setPlayer: setPlayer1 , playerBet: player1Bet, setPlayerBet: setPlayer1Bet, playerState: player1State, setPlayerState: setPlayer1State },
    1: { player: player2, setPlayer: setPlayer2 , playerBet: player2Bet, setPlayerBet: setPlayer2Bet, playerState: player2State, setPlayerState: setPlayer2State },
    2: { player: player3, setPlayer: setPlayer3 , playerBet: player3Bet, setPlayerBet: setPlayer3Bet, playerState: player3State, setPlayerState: setPlayer3State },
    3: { player: player4, setPlayer: setPlayer4 , playerBet: player4Bet, setPlayerBet: setPlayer4Bet, playerState: player4State, setPlayerState: setPlayer4State },
  };

  let [smallBlind, setSmallBlind] = useState(2 % 4); // player1 = 0 player4 = 3...
  let [bigBlind, setBigBlind] = useState((smallBlind + 1) % 4);
  let [currentTurn, setCurrentTurn] = useState((bigBlind + 1) % 4);

  let [minimalBet, setMinimalBet] = useState(10);
  let [currentBet, setCurrentBet] = useState(0);

  let [startDisabled, setStartDisabled] = useState(false);

  return (
    <>
      <Table
        cardStack={cardStack}
        cardRiver={cardRiver}
        coinStack={coinStack}
        players={[player1, player2, player3, player4]}
        coinValues={[
          { bet: player1Bet, total: getTotalChips(player1) },
          { bet: player2Bet, total: getTotalChips(player2) },
          { bet: player3Bet, total: getTotalChips(player3) },
          { bet: player4Bet, total: getTotalChips(player4) },
        ]}
        smallBlind={smallBlind}
        bigBlind={bigBlind}
        turn={currentTurn}
      />
      <StartButton
        disabled={startDisabled}
        onClick={() => {
          startNewRound();
          setStartDisabled(true);
        }}
      >
        Start
      </StartButton>
      <FoldButton onClick={() => handleFold({id: currentTurn})}>Fold</FoldButton>
      <CallButton onClick={() => handleCall({id: currentTurn})}>Call</CallButton>
      <RaiseButton onClick={() => handleRaise({id: currentTurn, amount: minimalBet*2})}>Raise</RaiseButton>
    </>
  );

  function startNewRound() {
    let currentCardStack = [...cardStack];
    let currentCardRiver = [...cardRiver];
    let currentCoinStack = { ...coinStack };

    burnFirstCard(currentCardStack);
    drawPlayerCards(currentCardStack, currentCoinStack);
    drawRiverCards(3, currentCardRiver, currentCardStack);

    setCardStack(currentCardStack);
    setCardRiver(currentCardRiver);
    setCoinStack(currentCoinStack);
  }

  function drawPlayerCards(currentCardStack, currentCoinStack) {
    function drawPlayer({ id }) {
      let {player, setPlayer} = playerIDs[id];

      let currentPlayer = { ...player };
      let { playerCoins, playerHand } = currentPlayer;

      let [card1, card2] = [currentCardStack.pop(), currentCardStack.pop()];
      playerHand.push(card1, card2);

      if (id == smallBlind) {
        getChips(currentCoinStack, playerCoins, minimalBet / 2, id);
      }

      if (id == bigBlind) {
        getChips(currentCoinStack, playerCoins, minimalBet, id);
      }

      setPlayer({ playerCoins, playerHand });
    }

    for(let i = 0; i < 4; i++) {
      drawPlayer({id: i})
    }
  }

  function drawRiverCards(amount, currentCardRiver, currentCardStack) {
    for (let i = 0; i < amount; i++) {
      currentCardRiver.push(currentCardStack.pop());
    }
  }

  function flipRiverCards(currentCardRiver, backwards, amount) {
    let i = 0;
    for (let card of currentCardRiver) {
      if(i < amount) {
        card.backwards = backwards;
      }
      i++;
    }
  }

  function burnFirstCard(currentCardStack) {
    currentCardStack.pop();
  }

  function getChips(currentCoinStack, playerCoins, amount, id) {

    function notEnough(left) {
      let has = getTotalChips({ playerCoins });
      return has < left;
    }

    let currentAmount = 0;
    let usedPlayerCoins = {
      black: 0,
      darkblue: 0,
      darkgreen: 0,
      darkred: 0,
    };

    // make sure player has the right coins otherwise this will infinite loop
    while (currentAmount < amount && !notEnough(amount - currentAmount)) {
      for (let coinType of coinTypes) {
        if(playerCoins[coinType] < 1) {
          continue; // maybe a mechanism that checks whether coins can be traded?
        }

        let coinValue = coinValues[coinType];
        if (coinValue <= amount - currentAmount) {
          usedPlayerCoins[coinType] += 1;
          playerCoins[coinType] -= 1;
          currentAmount += coinValue;
        }
      }
    }

    for (let coinType of coinTypes) {
      currentCoinStack[coinType] += usedPlayerCoins[coinType];
    }

    // update id's current bet.
    let {playerBet, setPlayerBet} = playerIDs[id];
    setPlayerBet(playerBet + currentAmount);
  }

  function getTotalChips({ playerCoins }) {
    let total = 0;
    for (let coinType of coinTypes) {
      total += coinValues[coinType] * playerCoins[coinType];
    }

    return total;
  }

  // should make copies of playerStates, update them and give them to handleTurnFinish
  function handleFold({id}) {
    let {setPlayerState} = playerIDs[id];
    setPlayerState("folded");
    handleTurnFinish({oldID: id});
  }

  // should make copies of playerStates, update them and give them to handleTurnFinish
  function handleCall({id}) {
    let currentCoinStack = {...coinStack}
    let {player, playerBet} = playerIDs[id];
    let {playerCoins} = player;
    let left = currentBet - playerBet;

    getChips(currentCoinStack, playerCoins, left, id); // shouldn't acces playerCoins directly, should copy it and setPlayer afterwards

    let {setPlayerState} = playerIDs[id];
    setPlayerState("waiting");

    setCoinStack(currentCoinStack);
    handleTurnFinish({oldID: id});
  }

  // should make copies of playerStates, update them and give them to handleTurnFinish
  function handleRaise({id, amount}) {
    let currentCoinStack = {...coinStack}
    let {player, playerBet} = playerIDs[id];
    let {playerCoins} = player;
    let newBet = currentBet + amount;
    let left = newBet - playerBet;

    getChips(currentCoinStack, playerCoins, left, id)

    for(let i = 0; i < 4; i++) {
      let {playerState, setPlayerState} = playerIDs[i];
      if(i == id || playerState == "folded") {
        continue;
      }
      setPlayerState("mustRaise");
    }

    setCoinStack(currentCoinStack);
    setCurrentBet(newBet);
    handleTurnFinish({oldID: id});
  }

  // since functions calling this update playerStates
  // it must get them as a copied updated values and give that to getNotFoldedPlayers
  // to make sure it uses the correct updated value
  function handleTurnFinish({oldID}) {
    let playersLeft = getNotFoldedPlayers();
    // handle round finish if == 1...
    // and check whether cycle has finished

    // get closest next player and set turn to that player
    for(let i = 1; i < 4; i++) {
      let id = (oldID + i) % 4
      if(playersLeft.includes(id)) {
        setCurrentTurn(id)
        break;
      }
    }
  }

  function getNotFoldedPlayers() {
    let playersLeft = [];
    for(let i = 0; i < 4; i++) {
      let {playerState} = playerIDs[i]
      if(playerState != "folded") {
        playersLeft.push(i)
      }
    }
    return playersLeft;
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
