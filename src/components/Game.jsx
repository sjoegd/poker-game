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

// playerStates = ['noturn', 'folded', 'waiting', 'mustRaise']

/**
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

  let [player1State, setPlayer1State] = useState('noturn');
  let [player2State, setPlayer2State] = useState('noturn');
  let [player3State, setPlayer3State] = useState('noturn');
  let [player4State, setPlayer4State] = useState('noturn');

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

  let [currentCycle, setCurrentCycle] = useState(0); 

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
      <FoldButton onClick={() => handleTurn(currentTurn, 'fold')}>Fold</FoldButton>
      <CallButton onClick={() => handleTurn(currentTurn, 'call')}>Call</CallButton>
      <RaiseButton onClick={() => handleTurn(currentTurn, 'raise', minimalBet*2)}>Raise</RaiseButton>
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

      if(id == 0) {
        card1.backwards = false;
        card2.backwards = false;
      }

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

  function handleTurn(id, move, amount) {
    let currentCoinStack = {...coinStack};
    let {player, setPlayer, playerBet, playerState, setPlayerState} = playerIDs[id];

    let otherPlayerStates = []
    for(let i = 0; i < 4; i++) {
      if(i == id) {
        continue;
      }

      let {playerState: otherPlayerState, setPlayerState: setOtherPlayerState} = playerIDs[i];
      otherPlayerStates.push({id: i, playerState: otherPlayerState,  setPlayerState: setOtherPlayerState})
    }

    let currentPlayer = {...player};
    let currentPlayerBet = {playerBet}; // make object of them so that it copies by reference
    let currentPlayerState = {playerState}; 
    let {playerCoins, playerHand} = currentPlayer;

    switch(move) {
      case 'fold':
        handleFold(currentPlayerState);
        break;
      case 'call':
        handleCall(id, currentCoinStack, currentPlayerState, playerCoins, currentPlayerBet);
        break;
      case 'raise':
        handleRaise(id, currentCoinStack, currentPlayerState, playerCoins, currentPlayerBet, otherPlayerStates, amount);
        break;
    }

    setCoinStack(currentCoinStack)
    setPlayer({playerCoins, playerHand});
    setPlayerState(currentPlayerState.playerState)

    for(let {playerState: otherPlayerState,  setPlayerState: setOtherPlayerState} of otherPlayerStates) {
      setOtherPlayerState(otherPlayerState);
    }

    handleTurnFinish(id, [...otherPlayerStates, {id, playerState: currentPlayerState.playerState, setPlayerState}]);
  }

  function handleFold(currentPlayerState) {
    currentPlayerState.playerState = "folded";
  }

  function handleCall(id, currentCoinStack, currentPlayerState, playerCoins, currentPlayerBet) {
    let left = currentBet - currentPlayerBet.playerBet;
    getChips(currentCoinStack, playerCoins, left, id);
    currentPlayerState.playerState = "waiting";
  }

  function handleRaise(id, currentCoinStack, currentPlayerState, playerCoins, currentPlayerBet, otherPlayerStates, amount) {

    let newBet = currentBet + amount;
    let left = newBet - currentPlayerBet.playerBet;

    getChips(currentCoinStack, playerCoins, left, id);
    setCurrentBet(newBet);

    for(let otherPlayerState of otherPlayerStates) {
      if(otherPlayerState.playerState != "folded") {
        otherPlayerState.playerState = "mustRaise"
      }
    }

    currentPlayerState.playerState = "waiting";
  }


  function handleTurnFinish(id, playerStates) {
    let playersLeft = getNotFoldedPlayerIDs(playerStates);

    // Check if round is over and handle it
    let roundDone = playersLeft.length == 1;

    if(roundDone) {
      endRound(playersLeft[0])
      return;
    }
    
    // Check if were done with this cycle and handle it
    let cycleDone = true;
    for(let {playerState} of playerStates) {
      if(playerState == "mustRaise" || playerState == "noturn") {
        cycleDone = false;
      }
    }

    if(cycleDone) {
      handleCycleFinish(currentCycle, playersLeft);
      return; 
    }

    // get closest next player and set turn to that player
    for(let i = 1; i < 4; i++) {
      let currentId = (id + i) % 4
      if(playersLeft.includes(currentId)) {
        setCurrentTurn(currentId)
        break;
      }
    }
  }

  function getNotFoldedPlayerIDs(playerStates) {
    let playersLeft = [];
    for(let i = 0; i < 4; i++) {
      let {id, playerState} = playerStates[i]
      if(playerState != "folded") {
        playersLeft.push(id)
      }
    }
    return playersLeft;
  }

  function handleCycleFinish(oldCycle, playersLeft) {
    // cycleOrder = ['beginning', 'round1', 'round2', 'round3', 'finished']
    // beginning: 3 mid cards closed, round1 open mid 3 cards, round2 add open 4th card, round3 add open 5th card, finished everyone left shows hand and winner determined

    let currentCardRiver = [...cardRiver]
    let currentCardStack = [...cardStack]

    for(let id of playersLeft) {
      let {setPlayerState} = playerIDs[id];
      setPlayerState('noturn')
    }

    switch(oldCycle) {
      case 0:
        // open 3 mid cards, then start new cycle
        flipRiverCards(currentCardRiver, false, 3);
        setCardRiver(currentCardRiver);
        startNewCycle(oldCycle, playersLeft);
        break;
      case 1:
        // add 4th card, start new cycle
        drawRiverCards(1, currentCardRiver, currentCardStack);
        flipRiverCards(currentCardRiver, false, 4);
        setCardRiver(currentCardRiver);
        setCardStack(currentCardStack);
        startNewCycle(oldCycle, playersLeft);
        break;
      case 2:
        // add 5th card, start new cycle
        drawRiverCards(1, currentCardRiver, currentCardStack);
        flipRiverCards(currentCardRiver, false, 5);
        setCardRiver(currentCardRiver);
        setCardStack(currentCardStack);
        startNewCycle(oldCycle, playersLeft);
        break;
      case 3:
        // Game is finished, determine winner end round
        //...
    }
  }


  function startNewCycle(oldCycle, playersLeft) {
    // give turn to correct player:
    for(let i = smallBlind; i < smallBlind + 4; i++) {
      if(playersLeft.includes(i % 4)) {
        setCurrentTurn(i);
        break;
      }
    }

    setCurrentCycle(oldCycle + 1);
  }

  // add handling same rank and ties, playersLeft must be > 0
  function determineWinner(playersLeft, currentCardRiver) {
    // determine winner of playersLeft with their current playerHand and the currentCardRiver
    // get highest ranking for each player, take the playerID with the highest rank and return it
    let playerRankings = [];

    for(let player of playersLeft) {
      let {player: {playerHand}} = playerIDs[player];
      let highestRank = getHighestRank(playerHand, currentCardRiver);
      playerRankings.push({id: player, highestRank});
    }

    let winner = playerRankings[0]
    for(let player of playerRankings) {
      if(player.highestRank > winner.highestRank) {
        winner = player
      }
    }
    
    return winner.id
  }

  function getHighestRank(playerHand, currentCardRiver) {
    let fullHand = [...playerHand, ...currentCardRiver];
    // use the evaluateHand function
  }

  // not certain whether the state variables will be correct here...
  function endRound(winnerId) {
    // clean up everything and prepare for next round

    let currentCoinStack = {...coinStack};
    let currentCardRiver = [...cardRiver];
    let currentCardStack = [...cardStack];

    let players = []

    for(let i = 0; i < 4; i++) {
      let {player, setPlayer , playerBet, setPlayerBet, playerState, setPlayerState} = playerIDs[i];
      players.push({player, setPlayer , playerBet, setPlayerBet, playerState, setPlayerState});
    }

    // give winner the coinStack and remove his cards, clear the coinStack
    let {player, setPlayer} = players[winnerId];
    let {playerCoins, playerHand} = player;

    for(let coinType of coinTypes) {
      playerCoins[coinType] += currentCoinStack[coinType];
      currentCoinStack[coinType] = 0;
    }

    playerHand = [];

    setPlayer({playerCoins, playerHand});

    // clear cardRiver and remake the cardStack

    currentCardRiver = [];
    currentCardStack = shuffleCardStack(getFreshCardStack());
    setCardRiver(currentCardRiver);
    setCardStack(currentCardStack);
    setCoinStack(currentCoinStack);

    // for all the players expect winner, keep their coinStack but remove the cards

    for(let i = 0; i < 4; i++) {

      // clear bets and state
      let {setPlayerBet, setPlayerState} = players[i];

      setPlayerBet(0);
      setPlayerState('noturn');

      // not winner
      if(i == winnerId) {
        continue;
      }

      let {player, setPlayer} = players[i];
      let {playerCoins} = player;

      setPlayer({playerCoins, playerHand: []})
    }

    // update smallBlind, bigBlind and currentTurn respectively
    setSmallBlind((smallBlind + 1) % 4);
    setBigBlind((bigBlind + 1) % 4);
    setCurrentTurn((bigBlind + 2) % 4)

    // clear the minimalBet and currentBet
    setMinimalBet(10);
    setCurrentBet(0);

    // clear currentCycle
    setCurrentCycle(0);

    // set startDisabled to false
    setStartDisabled(false);
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

// Methods for hand evaluation

// lower = better rank
let numberRanking = {
  'A': 1,
  'K': 2,
  'Q': 3,
  'J': 4,
  10: 5,
  9: 6,
  8: 7,
  7: 8,
  6: 9,
  5: 10,
  4: 11,
  3: 12,
  2: 13,
}

function evaluateHand(hand) {

  // make sets of 5 out the 7 element in hand (combinations)
  // for each check from isRoyalFlush to highestCard, then get the hand with highest ranking, return that ranking

  // Yes that means it will be enumerated 21 times.. which might not be optimal
  // optimizations can be made for that ^
  // royalFlush for example can be checked instantly with the 7 cards
  // same with 4 of a kind
  // and maybe others
  // but to check a straight flush, a straight might be present and a flush but not of the same sample of 5..
  // so they can only be checked for a certain sample of 5 so each sample has to be checked.

}

function isRoyalFlush(numbersOfType) {

  let royalFlushNumbers = ['A', 'K', 'Q', 'J', '10']

  for(let type of cardTypes) {
    let numbers = numbersOfType.get(type);
    let typeHasRoyalFlush = true;
    for(let royalNumber of royalFlushNumbers) {
      if(!numbers.includes(royalNumber)) {
        typeHasRoyalFlush = false
      }
    }
    if(typeHasRoyalFlush) {
      return true;
    }
  }

  return false
}

function isStraightFlush(numbersOfType) {

}

function isFourOfAKind(cardNumbers) {

}

function isFullHouse(cardTypes, cardNumbers) {
  // three of kind and pair

}

function isFlush(cardTypes, cardNumbers) {

  // for every type check whether the lenght of numbers of that type >= 5, if yes then return 

}

function isStraight(numbers) {

  // sort and remove duplicates, start of array is highest ranked element
  // A's should be evaluated both as highest ranked and as lowest in distinct evals
  // start checking for straight and if a straight is found return it, if not found return empty array.

}

// same code as pair
function isThreeOfAKind(countOfNumber, avoidedNumbers = []) {

}

function isTwoPair() {

}

function isPair() {

}

function HighCard(numbers) {

}
