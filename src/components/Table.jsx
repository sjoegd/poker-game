import React from 'react';
import styled from 'styled-components';

import Hand from './cards/Hand';
import CardRiver from './cards/CardRiver';
import CardStack from './cards/CardStack';

import CoinStack from './coins/CoinStack';

const TableContainer = styled.div`
  height: 60rem;
  width: 84rem; // 1.4*height
  border-radius: 50%;
  background: linear-gradient(216deg, rgba(53, 101, 77, 1) 1%, rgba(62, 149, 106, 1) 83%);
  box-shadow: -0.1rem 0 0.8rem 0 rgba(0, 0, 0, 1);
  display: grid;
  grid-template: 1fr 1fr 1fr/ 1fr 1fr 1fr;
  margin: auto;
  border: solid black 0.5rem;
  margin-top: 3rem;
`;

const HandContainer = styled.div`
  margin: auto;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CardRiverContainer = styled(HandContainer)`
  margin: 0 auto;
`;

const MiddleContainer = styled.div`
  grid-area: ${({ row, column }) => `${row} / ${column} / span 1 / span 1`};
  display: flex;
  flex-direction: column;
  margin: auto;
`;

const CoinStackContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const CardStackContainer = styled.div`
  grid-area: ${({ row, column }) => `${row} / ${column} / span 1 / span 1`};
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-bottom: 2rem;
`;

// make sure it has the same values as card
const HandWrapper = styled.div`
  width: calc(12rem + 4*0.125rem);
  height: calc(6rem * 1.4 + 4*0.125rem);
`

const PlayerHandContainer = styled.div`
  grid-area: ${({ row, column }) => `${row} / ${column} / span 1 / span 1`};
  rotate: ${({ rotate }) => `${rotate}deg`};
  margin: auto;
  position: relative;
`

const PlayerUIContainer = styled.div`
  box-sizing: border-box;
  position: absolute;
  rotate: ${({rotate}) => `${rotate ?? 0}deg`};
  background: ${({mainPlayer}) => mainPlayer ? "rgb(100, 100, 100)" : "grey"};
  width: 10rem;
  height: 5.5rem;
  margin-top: ${({fixRotate}) => `${fixRotate ? '2.65' : '0.25'}rem`};
  border: ${({turn, folded}) => turn ? "solid white 0.15rem" : folded ? "solid darkred 0.15rem" : "solid black 0.15rem"};
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: ${({turn, folded}) => `-0.1rem 0 0.8rem 0 ${turn ? 'white' : folded ? "darkred" : 'black'}`};
  display: flex;
  flex-direction: column;
`

const PlayerNumberUIContainer = styled.div`
  background: rgb(25,25,25);
  color: white;
  padding: 0 0.25rem;
  font-size: 1.1rem;
  height: 1.2rem;
`

const PlayerUIRowContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  margin: 0 0.1rem;
`

// do
const PlayerUIRow = styled.div`
  font-size: 0.85rem;
  margin: 0.05rem;
`

const BlindPlayerUIRow = styled(PlayerUIRow)`
  color: white;
  font-size: 0.7rem;
`

const TurnMessageContainer = styled.div`
  position: absolute;
  width: fit-content;
  color: white;
  font-size: 1.5rem;
  rotate: ${({rotate}) => `${rotate ?? 0}deg`};
  margin-left: ${({fixRotate}) => `${fixRotate ? '6.5' : '0.25'}rem`};
  margin-top: ${({fixRotate}) => `${fixRotate ? '7.5' : '5.75'}rem`}; ;
`

// * playerStates = [4 * {noturn -> waiting, folded (make special), waiting, mustRaise -> must call/raise, out}]
function getCorrectStateOutput(state) {
  switch(state) {
    case "noturn":
      return "waiting"
    case "mustRaise":
      return "must call or raise"
    default:
      return state
  }
}

// do
function PlayerUI(props) {
  return (
  <PlayerUIContainer rotate={props.rotate + (props.fixRotate ? 180 : 0)} fixRotate={props.fixRotate} mainPlayer={props.mainPlayer} turn={props.turn} folded={props.state=="folded" || props.state=="out"}>
    <PlayerNumberUIContainer>{props.playerName}</PlayerNumberUIContainer>
    <PlayerUIRowContainer>
      <PlayerUIRow>{`Total: ${props.total} `}</PlayerUIRow>
      <PlayerUIRow>{`Bet: ${props.bet}`}</PlayerUIRow>
      <PlayerUIRow>{getCorrectStateOutput(props.state)}</PlayerUIRow>
      {props.smallBlind ? <BlindPlayerUIRow>Small blind</BlindPlayerUIRow> : ""}
      {props.bigBlind ? <BlindPlayerUIRow>Big blind</BlindPlayerUIRow> : ""}
    </PlayerUIRowContainer>
  </PlayerUIContainer>
  );
}

function TurnMessage(props) {
  return (
    <TurnMessageContainer rotate={-props.rotate} fixRotate={props.fixRotate}>
      {props.message}
    </TurnMessageContainer>
  )
}

// Change small and big blind to be in playerInfo
function PlayerHand(props) {
  let { playerCoins, playerHand } = props.playerHand;

  return (
    <PlayerHandContainer row={props.row} column={props.column} rotate={props.rotate}>
      <HandContainer>
        <CoinStackContainer>
          <CoinStack 
            zIndex={props.fixZIndex ? 4 : 0} 
            rotate={-props.rotate} 
            amount={playerCoins.black} 
            color={'black'} 
          />
          <CoinStack
            zIndex={props.fixZIndex ? 3 : 0}
            rotate={-props.rotate}
            amount={playerCoins.darkblue}
            color={'darkblue'}
          />
          <CoinStack
            zIndex={props.fixZIndex ? 2 : 0}
            rotate={-props.rotate}
            amount={playerCoins.darkgreen}
            color={'darkgreen'}
          />
          <CoinStack
            zIndex={props.fixZIndex ? 1 : 0}
            rotate={-props.rotate}
            amount={playerCoins.darkred}
            color={'darkred'}
          />
        </CoinStackContainer>
        <HandWrapper><Hand cards={playerHand} /></HandWrapper>
      </HandContainer>
      <PlayerUI 
        turn={props.turn}
        total={props.coinValues.total}
        bet={props.coinValues.bet}
        state={props.playerState}
        mainPlayer={props.mainPlayer}
        playerName={props.playerName}
        smallBlind={props.smallBlind}
        bigBlind={props.bigBlind}
        rotate={props.rotate}
        fixRotate={props.fixRotate}
      />
      <TurnMessage message={props.turnMessage} rotate={props.rotate} fixRotate={props.fixRotate}/>
    </PlayerHandContainer>
  );
}

//do
function TableMiddle(props) {
  // props.coinStackValue
  return (
    <MiddleContainer row={props.row} column={props.column}>
      <CoinStackContainer>
        <CoinStack amount={props.coinStack.black} color={'black'} />
        <CoinStack amount={props.coinStack.darkblue} color={'darkblue'} />
        <CoinStack amount={props.coinStack.darkgreen} color={'darkgreen'} />
        <CoinStack amount={props.coinStack.darkred} color={'darkred'} />
      </CoinStackContainer>
      <CardRiverContainer>
        <CardRiver cards={props.cardRiver} />
      </CardRiverContainer>
    </MiddleContainer>
  );
}

/**
 * Input:
 * players = [4 * playerHand]
 * cardStack = []
 * cardRiver = [] max 5
 * coinStack = playerCoins
 * coinStackValue = number
 * coinValues = [4 * {bet, total}]
 * playerStates = [4 * {noturn -> waiting, folded (make special), waiting, mustRaise -> must call/raise, out}]
 * smallBlind = id
 * bigBlind = id
 * turn = id
 * turnMessages = [4 * string]
 * playerNames = [4* string]
 * @returns The Table UI
 */

export default function Table(props) {

  return (
    <TableContainer>
      <CardStackContainer row={1} column={1}>
        <CardStack cards={props.cardStack} />
      </CardStackContainer>
      <PlayerHand
        playerHand={props.players[0]}
        coinValues={props.coinValues[0]}
        playerState={props.playerStates[0]}
        bigBlind={props.bigBlind == 0}
        smallBlind={props.smallBlind == 0}
        turn={props.turn == 0}
        mainPlayer={true}
        playerName={props.playerNames[0]}
        turnMessage={props.turnMessages[0]}
        row={3}
        column={2}
        rotate={0}
      />
      <PlayerHand
        playerHand={props.players[1]}
        coinValues={props.coinValues[1]}
        playerState={props.playerStates[1]}
        bigBlind={props.bigBlind == 1}
        smallBlind={props.smallBlind == 1}
        turn={props.turn == 1}
        mainPlayer={false}
        playerName={props.playerNames[1]}
        turnMessage={props.turnMessages[1]}
        row={2}
        column={1}
        rotate={90}
        fixRotate={true}
      />
      <PlayerHand
        playerHand={props.players[2]}
        coinValues={props.coinValues[2]}
        playerState={props.playerStates[2]}
        bigBlind={props.bigBlind == 2}
        smallBlind={props.smallBlind == 2}
        turn={props.turn == 2}
        mainPlayer={false}
        playerName={props.playerNames[2]}
        turnMessage={props.turnMessages[2]}
        row={1}
        column={2}
        rotate={180}
      />
      <PlayerHand
        playerHand={props.players[3]}
        coinValues={props.coinValues[3]}
        playerState={props.playerStates[3]}
        bigBlind={props.bigBlind == 3}
        smallBlind={props.smallBlind == 3}
        turn={props.turn == 3}
        mainPlayer={false}
        playerName={props.playerNames[3]}
        turnMessage={props.turnMessages[3]}
        row={2}
        column={3}
        rotate={270}
        fixZIndex={true}
        fixRotate={true}
      />
      <TableMiddle row={2} column={2} cardRiver={props.cardRiver} coinStack={props.coinStack} coinStackValue={props.coinStackValue} />
    </TableContainer>
  );
}
