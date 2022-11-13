import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { evaluateHand, compareHandInfos, getRankOfHandOfFive } from '../helpers/HandEval';
import henk from '../bots/henk/henk.js';
import henk_v2 from '../bots/henk_v2/henk_v2.js'

import Table from './Table';

// do
const GameContainer = styled.div``;

const Button = styled.button`
  border: solid 0.1rem black;
  margin: 0 0.25rem;
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

const StartButton = styled(Button)``;
const FoldButton = styled(Button)``;
const CallButton = styled(Button)``;
const RaiseButton = styled(Button)``;

const RaiseSlideContainer = styled.div`
  width: fit-content;
  margin-left: 19.75rem;
  outline: none;
  margin-top: 0.25rem;
`

const RaiseInput = styled.input`
  appearance: none;
  background: rgb(225, 225, 225);
  opacity: 0.7;
  transition: opacity .2s;
  border-radius: 1rem;
  width: 8rem;
  height: 0.75rem;

  &:hover {
    opacity: 0.95;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: rgba(53, 101, 77, 1);
    height: 1.25rem;
    width: 1.25rem;
    border-radius: 1rem;
    cursor: w-resize;
  }
`

const RaiseInputShower = styled.div`
  width: 8rem;
  color: white;
  font-weight: 500;
  font-size: 1.2rem;
  user-select: none;
`

const WinnerShow = styled.div`
  position: fixed;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  font-size: 8rem;
`;

// Card = {number: ..., type: ... backwards: ...};
// playerCoins = {black: ..., darkblue: ..., darkgreen: ..., darkred: ...};
// playerCards = [Card1, Card2];
// playerHand = {playerCoins, playerCards};

let cardTypes = ['club', 'heart', 'diamond', 'spade'];
let cardNumbers = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

let baseCoins = {
  black: 10,
  darkblue: 10,
  darkgreen: 10,
  darkred: 10,
};

let coinValues = {
  black: 1000,
  darkblue: 750,
  darkgreen: 500,
  darkred: 250,
};

let coinTypes = ['black', 'darkblue', 'darkgreen', 'darkred'];

// playerStates = ['noturn', 'folded', 'waiting', 'mustRaise', 'out']

// all data
// {playerID, handCard1, handCard2, rankWithRiver, playerBet, currentBet, playerState, currentCycle, move, won}

/**
 * TODO:
 * open cards of playersLeft when determining winner (and take some time on open and show winner)
 * Upgrade AI
 *
 * gets:
 * updateData = f
 * createNewGame = f
 * 
 * @returns Component that manages the Game
 */

export default function Game(props) {
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
    0: {
      player: player1,
      setPlayer: setPlayer1,
      playerBet: player1Bet,
      setPlayerBet: setPlayer1Bet,
      playerState: player1State,
      setPlayerState: setPlayer1State,
    },
    1: {
      player: player2,
      setPlayer: setPlayer2,
      playerBet: player2Bet,
      setPlayerBet: setPlayer2Bet,
      playerState: player2State,
      setPlayerState: setPlayer2State,
    },
    2: {
      player: player3,
      setPlayer: setPlayer3,
      playerBet: player3Bet,
      setPlayerBet: setPlayer3Bet,
      playerState: player3State,
      setPlayerState: setPlayer3State,
    },
    3: {
      player: player4,
      setPlayer: setPlayer4,
      playerBet: player4Bet,
      setPlayerBet: setPlayer4Bet,
      playerState: player4State,
      setPlayerState: setPlayer4State,
    },
  };

  let [smallBlind, setSmallBlind] = useState(2 % 4); // player1 = 0 player4 = 3...
  let [bigBlind, setBigBlind] = useState((smallBlind + 1) % 4);
  let [currentTurn, setCurrentTurn] = useState((bigBlind + 1) % 4);

  let [minimalBet, setMinimalBet] = useState(coinValues['darkred'] * 2);
  let [currentBet, setCurrentBet] = useState(minimalBet);

  let [currentCycle, setCurrentCycle] = useState(0);

  let [startDisabled, setStartDisabled] = useState(false);

  let [gameOver, setGameOver] = useState(false);
  let [winner, setWinner] = useState(0);

  let [player1TurnMessage, setPlayer1TurnMessage] = useState('');
  let [player2TurnMessage, setPlayer2TurnMessage] = useState('');
  let [player3TurnMessage, setPlayer3TurnMessage] = useState('');
  let [player4TurnMessage, setPlayer4TurnMessage] = useState('');

  let turnMessageSetters = {
    0: { setPlayerTurnMessage: setPlayer1TurnMessage },
    1: { setPlayerTurnMessage: setPlayer2TurnMessage },
    2: { setPlayerTurnMessage: setPlayer3TurnMessage },
    3: { setPlayerTurnMessage: setPlayer4TurnMessage },
  };

  // special variable to make sure useEffect listens correctly
  let [effectListener, setEffectListener] = useState(true);

  // Winner listener

  useEffect(() => {
    let alivePlayers = getAlivePlayers();
    if (alivePlayers.length == 1) {
      let winner = alivePlayers[0];
      setStartDisabled(true);
      setGameOver(true);
      setWinner(winner);
      props.updateData(allData);
      props.createNewGame();
    }
  }, [currentCycle, effectListener]);

  // Bots

  // Temp for data generation
  // useEffect(() => {
  //   if (!startDisabled) {
  //     startNewRound();
  //     setStartDisabled(true);
  //   }
  // }, [startDisabled]);

  // Automatic turns when turn is not for the player
  useEffect(() => {
    if (gameOver) {
      return;
    }
    // (currentTurn % 4 != 0)
    // time should be 2000
    if ((currentTurn % 4 != 0) && startDisabled) {
      setTimeout(() => generateTurnAction(), 2000);
    }
  }, [currentTurn, startDisabled, gameOver, effectListener]);

  // For data
  let [currentRoundData, setCurrentRoundData] = useState([]);
  let [allData, setAllData] = useState([]);

  // For raising
  let [minRaise, setMinRaise] = useState(getRaise(0))
  let [currentRaiseInput, setCurrentRaiseInput] = useState(minRaise);

  return (
    <GameContainer>
      {gameOver ? <WinnerShow> {winner == 0 ? 'You won!' : `Player ${winner + 1} won`} </WinnerShow> : ''}
      <Table
        cardStack={cardStack}
        cardRiver={cardRiver}
        coinStack={coinStack}
        coinStackValue={getTotalChips({ playerCoins: coinStack })}
        players={[player1, player2, player3, player4]}
        coinValues={[
          { bet: player1Bet, total: getTotalChips(player1) },
          { bet: player2Bet, total: getTotalChips(player2) },
          { bet: player3Bet, total: getTotalChips(player3) },
          { bet: player4Bet, total: getTotalChips(player4) },
        ]}
        playerStates={[player1State, player2State, player3State, player4State]}
        smallBlind={smallBlind}
        bigBlind={bigBlind}
        turn={currentTurn}
        turnMessages={[player1TurnMessage, player2TurnMessage, player3TurnMessage, player4TurnMessage]}
        playerNames={['Me', 'Henk_v2 1', 'Henk_v2 2', 'Henk_v2 3']}
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
      <FoldButton
        disabled={currentTurn != 0 || !startDisabled || gameOver}
        onClick={() => handleTurn(currentTurn, 'fold')}
      >
        Fold
      </FoldButton>
      <CallButton
        disabled={currentTurn != 0 || !startDisabled || gameOver}
        onClick={() => handleTurn(currentTurn, 'call')}
      >
        {isCheckOrBet(0) ? 'Check' : 'Call'}
      </CallButton>
      <RaiseButton
        disabled={currentTurn != 0 || !startDisabled || gameOver || isRaiseDisabled()}
        onClick={() => handleTurn(currentTurn, 'raise', Math.round(currentRaiseInput))}
      >
        {isCheckOrBet(0) ? 'Bet' : 'Raise'}
      </RaiseButton>
      <RaiseSlideContainer>
        <RaiseInput type='range' step={(coinValues['darkred'] / getTotalChips(player1)) * 100} min={(minRaise / getTotalChips(player1)) * 100} max={100.1} value={(currentRaiseInput / getTotalChips(player1)) * 100} onInput={(event) => setCurrentRaiseInput((event.target.value / 100) * getTotalChips(player1))}/>
        <RaiseInputShower>{Math.min(Math.max(0, Math.round(currentRaiseInput)) + (currentBet - player1Bet), getTotalChips(player1))}</RaiseInputShower>
      </RaiseSlideContainer>
    </GameContainer>
  );
  
  function isCheckOrBet(id) {
    let {playerBet} = playerIDs[id]
    return currentTurn == id && playerBet == currentBet
  }

  function getRaise(id, newCurrentBet) {
    let { player, playerBet } = playerIDs[id ?? currentTurn];
    let raise = Math.min(getTotalChips(player) + playerBet - (newCurrentBet ?? currentBet),  (newCurrentBet ?? currentBet) ?  (newCurrentBet ?? currentBet) : minimalBet);
    return raise;
  }

  function isRaiseDisabled() {
    // playerBet + totalChips <= currentBet
    let { player, playerBet } = playerIDs[currentTurn];
    let totalChips = getTotalChips(player);
    return totalChips <= currentBet - playerBet || totalChips == 0;
  }

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

    // handle data
    setCurrentRoundData([]);
  }

  function drawPlayerCards(currentCardStack, currentCoinStack) {
    function drawPlayer({ id }) {
      let { player, setPlayer, playerState } = playerIDs[id];

      if (playerState == 'out') {
        return;
      }

      let currentPlayer = { ...player };
      let { playerCoins, playerHand } = currentPlayer;

      let [card1, card2] = [currentCardStack.pop(), currentCardStack.pop()];

      if (id == 0) {
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

    for (let i = 0; i < 4; i++) {
      drawPlayer({ id: i });
    }
  }

  function drawRiverCards(amount, currentCardRiver, currentCardStack) {
    for (let i = 0; i < amount; i++) {
      if(currentCardRiver.length == 5) {
        return;
      }
      currentCardRiver.push(currentCardStack.pop());
    }
  }

  function flipRiverCards(currentCardRiver, backwards, amount) {
    let i = 0;
    for (let card of currentCardRiver) {
      if (i < amount) {
        card.backwards = backwards;
      }
      i++;
    }
  }

  function burnFirstCard(currentCardStack) {
    currentCardStack.pop();
  }

  // should distribute coins better
  // take amount from playerCoins and give it to currentCoinStack
  function getChips(currentCoinStack, playerCoins, amount, id) {
    let totalRedCoinsPlayer = 0;
    let redValue = coinValues['darkred'];

    // calculate totalCoinValue in reds
    // and take all players coins

    for (let coinType of coinTypes) {
      let coinValue = coinValues[coinType];
      totalRedCoinsPlayer += playerCoins[coinType] * (coinValue / redValue);
      playerCoins[coinType] = 0;
    }

    let redCoinsTaken = 0;
    let redCoinsToGiveStack = amount / redValue;

    // give correct coins to stack

    while (redCoinsToGiveStack > 0 && totalRedCoinsPlayer - redCoinsTaken > 0) {
      let amountToGiveLeft = redValue * redCoinsToGiveStack;
      for (let coinType of coinTypes) {
        let coinValue = coinValues[coinType];
        if (coinValue <= amountToGiveLeft) {
          currentCoinStack[coinType] += 1;
          redCoinsToGiveStack -= coinValue / redValue;
          redCoinsTaken += coinValue / redValue;
          break;
        }
      }
    }

    // give back correct coins to player

    totalRedCoinsPlayer -= redCoinsTaken;

    while (totalRedCoinsPlayer > 0) {
      let amountToGiveLeft = redValue * totalRedCoinsPlayer;
      for (let coinType of coinTypes) {
        let coinValue = coinValues[coinType];
        if (coinValue <= amountToGiveLeft) {
          playerCoins[coinType] += 1;
          totalRedCoinsPlayer -= coinValue / redValue;
          break;
        }
      }
    }

    // update id's current bet.
    let { playerBet, setPlayerBet } = playerIDs[id];
    setPlayerBet(playerBet + redCoinsTaken * redValue);
  }

  function getTotalChips({ playerCoins }) {
    let total = 0;
    for (let coinType of coinTypes) {
      total += coinValues[coinType] * playerCoins[coinType];
    }

    return total;
  }

  // mogelijke extra attributes:
  // rank verbeteraars zoals almost flush etc
  function generateTurnData(id, move) {
    // {playerID, handCard1, handCard2, rankWithRiver, playerBet, currentBet, playerState, currentCycle, move, won}
    let { player, playerState } = playerIDs[id];
    let { playerHand } = player;

    let rankWithRiver = 10;

    if (cardRiver.length == 3) {
      rankWithRiver = getRankOfHandOfFive([...playerHand, ...cardRiver]);
    }

    if (cardRiver.length == 4 || cardRiver.length == 5) {
      rankWithRiver = evaluateHand([...playerHand, ...cardRiver]).rank;
    }

    let roundData = [...currentRoundData];
    roundData.push({
      playerID: id,
      handCard1: playerHand[0],
      handCard2: playerHand[1],
      rankWithRiver,
      playerState,
      currentCycle,
      move,
    });

    setCurrentRoundData(roundData);
  }

  function handleTurn(id, move, amount) {
    generateTurnData(id, move);

    let currentCoinStack = { ...coinStack };
    let { player, setPlayer, playerBet, playerState, setPlayerState } = playerIDs[id];

    let otherPlayerStates = [];
    for (let i = 0; i < 4; i++) {
      if (i == id) {
        continue;
      }

      let { playerState: otherPlayerState, setPlayerState: setOtherPlayerState } = playerIDs[i];
      otherPlayerStates.push({ id: i, playerState: otherPlayerState, setPlayerState: setOtherPlayerState });
    }

    let currentPlayer = { ...player };
    let currentPlayerBet = { playerBet }; // make object of them so that it copies by reference
    let currentPlayerState = { playerState };
    let { playerCoins, playerHand } = currentPlayer;

    switch (move) {
      case 'fold':
        handleFold(currentPlayerState);
        break;
      case 'call':
        handleCall(id, currentCoinStack, currentPlayerState, playerCoins, currentPlayerBet);
        break;
      case 'raise':
        amount = handleRaise(id, currentCoinStack, currentPlayerState, playerCoins, currentPlayerBet, otherPlayerStates, amount);
        break;
    }

    setCoinStack(currentCoinStack);
    setPlayer({ playerCoins, playerHand });
    setPlayerState(currentPlayerState.playerState);

    for (let { playerState: otherPlayerState, setPlayerState: setOtherPlayerState } of otherPlayerStates) {
      setOtherPlayerState(otherPlayerState);
    }

    handleTurnFinish(
      id,
      [...otherPlayerStates, { id, playerState: currentPlayerState.playerState, setPlayerState }],
      currentCoinStack
    );
    // handle turn message:
    setTurnMessage(id, move, amount);
  }

  function handleFold(currentPlayerState) {
    currentPlayerState.playerState = 'folded';
  }

  function handleCall(id, currentCoinStack, currentPlayerState, playerCoins, currentPlayerBet) {
    let left = currentBet - currentPlayerBet.playerBet;
    let total = getTotalChips({ playerCoins });
    left = Math.min(left, total);
    getChips(currentCoinStack, playerCoins, left, id);
    currentPlayerState.playerState = 'waiting';
  }

  // Player shouldn't be able to raise if he/she can't afford to pay the currentBet
  function handleRaise(
    id,
    currentCoinStack,
    currentPlayerState,
    playerCoins,
    currentPlayerBet,
    otherPlayerStates,
    amount
  ) {
    // raises currentBet to currentBet + amount
    // get how much money the player currently has
    let playerTotal = getTotalChips({ playerCoins });
    // calculate how much money the player must pay to get to the currentBet
    let leftToPayBeforeRaise = currentBet - currentPlayerBet.playerBet;

    let playerTotalAfterCall = playerTotal - leftToPayBeforeRaise;

    amount = Math.min(amount, playerTotalAfterCall);

    // Calculate new bet
    let newBet = currentBet + amount;
    // Calculate the money left to pay
    let left = newBet - currentPlayerBet.playerBet;

    getChips(currentCoinStack, playerCoins, left, id);

    setCurrentBet(newBet);
    setMinRaise(getRaise(0, newBet));
    setCurrentRaiseInput(getRaise(0, newBet))

    for (let otherPlayerState of otherPlayerStates) {
      if (otherPlayerState.playerState != 'folded' && otherPlayerState.playerState != 'out') {
        otherPlayerState.playerState = 'mustRaise';
      }
    }

    currentPlayerState.playerState = 'waiting';
    return amount;
  }

  function handleTurnFinish(id, playerStates, currentCoinStack) {
    let playersLeft = getNotFoldedPlayerIDs(playerStates);

    // Check if round is over and handle it
    let roundDone = playersLeft.length == 1;

    if (roundDone) {
      endRound(playersLeft[0], currentCoinStack);
      return;
    }

    // Check if were done with this cycle and handle it
    let cycleDone = true;
    for (let { playerState } of playerStates) {
      if (playerState == 'mustRaise' || playerState == 'noturn') {
        cycleDone = false;
      }
    }

    if (cycleDone) {
      handleCycleFinish(currentCycle, playersLeft, currentCoinStack, playerStates);
      return;
    }

    // get closest next player and set turn to that player
    for (let i = 1; i < 4; i++) {
      let currentId = (id + i) % 4;
      if (playersLeft.includes(currentId)) {
        setCurrentTurn(currentId);
        setEffectListener(!effectListener);
        break;
      }
    }
  }

  function getNotFoldedPlayerIDs(playerStates) {
    let playersLeft = [];
    for (let i = 0; i < 4; i++) {
      let { id, playerState } = playerStates[i];
      if (playerState != 'folded' && playerState != 'out') {
        playersLeft.push(id);
      }
    }
    return playersLeft;
  }

  // if someone is all-in, go to the last round instantly
  function handleCycleFinish(oldCycle, playersLeft, currentCoinStack, playerStates) {
    // cycleOrder = ['beginning', 'round1', 'round2', 'round3', 'finished']
    // beginning: 3 mid cards closed, round1 open mid 3 cards, round2 add open 4th card, round3 add open 5th card, finished everyone left shows hand and winner determined

    let currentCardRiver = [...cardRiver];
    let currentCardStack = [...cardStack];

    for (let id of playersLeft) {
      let { setPlayerState } = playerIDs[id];
      setPlayerState('noturn');
    }

    // check if allIn cycle
    let allInPlayer = false
    for(let {id, playerState} of playerStates) {
      let {player: {playerCoins}} = playerIDs[id]
      if(getTotalChips({playerCoins}) == 0 && playerState != "out" && playerState != "folded") {
        allInPlayer = true
      }
    }

    if(allInPlayer && oldCycle != 3) {
      handleAllInCycle(currentCardRiver, currentCardStack, currentCoinStack, playersLeft);
      return;
    }

    switch (oldCycle) {
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
        let winner = determineWinner(playersLeft, currentCardRiver);
        endRound(winner, currentCoinStack);
    }
  }

  function startNewCycle(oldCycle, playersLeft) {
    // give turn to correct player:
    for (let i = smallBlind; i < smallBlind + 4; i++) {
      let currentId = i % 4;
      if (playersLeft.includes(currentId)) {
        setCurrentTurn(currentId);
        setEffectListener(!effectListener);
        break;
      }
    }

    setCurrentCycle(oldCycle + 1);
  }

  function handleAllInCycle(currentCardRiver, currentCardStack, currentCoinStack, playersLeft) {
    drawRiverCards(5 - currentCardRiver.length, currentCardRiver, currentCardStack)
    flipRiverCards(currentCardRiver, false, 5);
    let winner = determineWinner(playersLeft, currentCardRiver);
    endRound(winner, currentCoinStack);
  }

  // playersLeft must be > 0
  function determineWinner(playersLeft, currentCardRiver) {
    let playerRankings = [];

    for (let player of playersLeft) {
      let {
        player: { playerHand },
      } = playerIDs[player];
      let highestHand = getHighestHand(playerHand, currentCardRiver);
      // console.log({highestHand})
      playerRankings.push({ id: player, highestHand });
    }

    // Comparison should be different: look evaluateHand()

    let winner = playerRankings[0];
    for (let player of playerRankings) {
      if (compareHandInfos(player.highestHand, winner.highestHand)) {
        winner = { ...player };
      }
    }

    // console.log({winner})

    return winner.id;
  }

  function getHighestHand(playerHand, currentCardRiver) {
    let fullHand = [...playerHand, ...currentCardRiver];
    // console.log({fullHand})
    return evaluateHand(fullHand);
  }

  // not certain whether the state variables will be correct here...
  function endRound(winnerId, currentCoinStack) {
    // handle roundData
    currentRoundData.forEach(data => {
      data.won = data.playerID == winnerId;
    });

    let currentAllData = [...allData];
    currentAllData.push(...currentRoundData);
    setAllData(currentAllData);

    // clean up everything and prepare for next round

    let currentCardRiver = [...cardRiver];
    let currentCardStack = [...cardStack];

    let players = [];

    for (let i = 0; i < 4; i++) {
      let { player, setPlayer, playerBet, setPlayerBet, playerState, setPlayerState } = playerIDs[i];
      players.push({ player, setPlayer, playerBet, setPlayerBet, playerState, setPlayerState });
    }

    // give winner the coinStack and remove his cards, clear the coinStack
    let { player, setPlayer } = players[winnerId];
    let { playerCoins, playerHand } = player;

    for (let coinType of coinTypes) {
      playerCoins[coinType] += currentCoinStack[coinType];
      currentCoinStack[coinType] = 0;
    }

    playerHand = [];

    setPlayer({ playerCoins, playerHand });

    // clear cardRiver and remake the cardStack

    currentCardRiver = [];
    currentCardStack = shuffleCardStack(getFreshCardStack());
    setCardRiver(currentCardRiver);
    setCardStack(currentCardStack);
    setCoinStack(currentCoinStack);

    // for all the players expect winner, keep their coinStack but remove the cards

    for (let i = 0; i < 4; i++) {
      // clear bets and state
      let { player, setPlayer, playerBet, setPlayerBet, playerState, setPlayerState } = players[i];
      let { playerCoins } = player;

      setPlayerBet(0);

      // Calculate if player is dead
      if (getTotalChips({ playerCoins }) == 0 || playerState == 'out') {
        setPlayerState('out');
        players[i] = { player, setPlayer, playerBet: 0, setPlayerBet, playerState: 'out', setPlayerState };
        setPlayer({ playerCoins, playerHand: [] });
        continue;
      }

      setPlayerState('noturn');
      players[i] = { player, setPlayer, playerBet, setPlayerBet, playerState: 'noturn', setPlayerState };

      // not winner
      if (i == winnerId) {
        continue;
      }

      setPlayer({ playerCoins, playerHand: [] });
    }

    let newSmallBlind = (smallBlind + 1) % 4;
    let playerState = players[newSmallBlind].playerState;

    while (playerState == 'out') {
      newSmallBlind = (newSmallBlind + 1) % 4;
      playerState = players[newSmallBlind].playerState;
    }

    let newBigBlind = (newSmallBlind + 1) % 4;
    playerState = players[newBigBlind].playerState;

    while (playerState == 'out') {
      newBigBlind = (newBigBlind + 1) % 4;
      playerState = players[newBigBlind].playerState;
    }

    let newCurrentTurn = (newBigBlind + 1) % 4;
    playerState = players[newCurrentTurn].playerState;

    while (playerState == 'out') {
      newCurrentTurn = (newCurrentTurn + 1) % 4;
      playerState = players[newCurrentTurn].playerState;
    }

    // update smallBlind, bigBlind and currentTurn respectively
    setSmallBlind(newSmallBlind);
    setBigBlind(newBigBlind);
    setCurrentTurn(newCurrentTurn);
    setEffectListener(!effectListener);

    // clear the minimalBet and currentBet
    setMinimalBet(coinValues['darkred'] * 2);
    setCurrentBet(coinValues['darkred'] * 2);
    setMinRaise(getRaise(0, coinValues['darkred'] * 2));
    setCurrentRaiseInput(getRaise(0, coinValues['darkred'] * 2))

    // clear currentCycle
    setCurrentCycle(0);

    // set startDisabled to false
    setStartDisabled(false);
  }

  function getAlivePlayers() {
    let alivePlayers = [];
    for (let i = 0; i < 4; i++) {
      let { playerState } = playerIDs[i];
      if (playerState != 'out') {
        alivePlayers.push(i);
      }
    }
    return alivePlayers;
  }

  // todo: generate bluffing, and some random folds since bots still go all in
  // and if enemy raises, sometimes bluff or check what my win percentage is and look based on that to have a more human like bot
  // and if call does not cost any money, never fold.
  // and if raiseOutput is insanely high make sure to always raise if possible
  function generateTurnAction() {
    // henk takes:
    // number1
    // type1
    // number2
    // rankWithRiver
    // playerState
    // currentCycle
    // move

    let { player, playerState, playerBet } = playerIDs[currentTurn];
    let { playerCoins, playerHand } = player;
    let [{ number: number1, type: type1 }, { number: number2, type: type2 }] = playerHand;

    let rankWithRiver = 10;

    if (cardRiver.length == 3) {
      rankWithRiver = getRankOfHandOfFive([...playerHand, ...cardRiver]);
    }

    if (cardRiver.length == 4 || cardRiver.length == 5) {
      rankWithRiver = evaluateHand([...playerHand, ...cardRiver]).rank;
    }

    let inputCall = { number1, type1, number2, type2, rankWithRiver, playerState, currentCycle, move: 'call' };
    let inputRaise = { number1, type1, number2, type2, rankWithRiver, playerState, currentCycle, move: 'raise' };

    let outputCall;
    let outputRaise;

    if(currentTurn != 0) {
      // use henk_v2
      outputCall = henk_v2(inputCall).won;
      outputRaise = henk_v2(inputRaise).won;
    } 
    // use normal henk
    // outputCall = henk(inputCall).won;
    // outputRaise = henk(inputRaise).won;

    // calculate amount i have to pay with raise/call
    let toCallPercentage = (currentBet - playerBet) / getTotalChips({playerCoins});
    let toRaisePercentage = ((currentBet * 2) - playerBet) / getTotalChips({playerCoins})

    let isWorthItCall = 1 - toCallPercentage
    let isWorthItRaise = 1 - toRaisePercentage

    let isNotWorthItCall = false
    let isNotWorthItRaise = false

    if(isWorthItCall < 0.5 && outputCall < 0.8) {
      // i want to be pretty certain i win if i spent more than halve my money..
      isNotWorthItCall = true
    } 

    if(isWorthItRaise < 0.5 && outputRaise < 0.8) {
      // i want to be pretty certain i win if i spent more than halve my money..
      isNotWorthItRaise = true
    }

    if (outputCall > 0.6 || outputRaise > 0.6) {
      // theres a higher chance that i am winning than losing

      // call for sure
      if(outputCall > 0.95) {
        handleTurn(currentTurn, 'call');
      }
      // raise for sure
      if(outputRaise > 0.95 && !isRaiseDisabled()) {
        handleTurn(currentTurn, 'raise', getRaise());
      }
      // raise with if good call
      if ((outputRaise > outputCall && outputRaise > 0.7) && !isRaiseDisabled() && !isNotWorthItRaise) {
        handleTurn(currentTurn, 'raise', getRaise());
        return;
      } 
      // now im pretty sure raising is not the best option so its probably better to call
      // but only if i dont spend to much money with a bad win chance
      if(!isNotWorthItCall && (currentBet == playerBet || playerState != "mustRaise" || getTotalChips({playerCoins}) == 0 || outputCall > 0.6)) {
        handleTurn(currentTurn, 'call');
        return;
      }
      // else i just fold
      handleTurn(currentTurn, 'fold');
      return;
    } else {
      // i usually don't win in this spot
      // but i like bluffers so i sometimes (1/10) bluff it for the memes
      // note that for this to work, the data should consider blufffer previous turns
      // ** bluff code **

      // check to see if the call is a check (no money lost)
      if(!isNotWorthItCall && (currentBet == playerBet || playerState != "mustRaise" || getTotalChips({playerCoins}) == 0 || outputCall > 0.6)) {
        // in that case i always call, since it pointless to fold on a check
        handleTurn(currentTurn, 'call');
        return;
      }

      // now i'm pretty sure i should fold
      handleTurn(currentTurn, 'fold');
      return;
    }
  }

  function setTurnMessage(id, turn, amount) {
    let { setPlayerTurnMessage } = turnMessageSetters[id];
    switch (turn) {
      case 'fold':
        setPlayerTurnMessage('Folded');
        break;
      case 'call':
        setPlayerTurnMessage(isCheckOrBet(id) ? 'Checked' : 'Called');
        break;
      case 'raise':
        setPlayerTurnMessage(isCheckOrBet(id) ? `Bet ${amount}` : `Raised ${amount}`);
        break;
    }
    setTimeout(() => clearTurnMessage(id), 1500);
  }

  function clearTurnMessage(id) {
    let { setPlayerTurnMessage } = turnMessageSetters[id];
    setPlayerTurnMessage('');
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
