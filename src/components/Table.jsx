import React from 'react';
import styled from 'styled-components';

import Hand from './cards/Hand';
import CardRiver from './cards/CardRiver';
import CardStack from './cards/CardStack';

import CoinStack from './coins/CoinStack';

const TableContainer = styled.div`
  height: 60rem;
  width: 84rem;
  border-radius: 50%;
  background: linear-gradient(216deg, rgba(53, 101, 77, 1) 1%, rgba(62, 149, 106, 1) 83%);
  box-shadow: -0.1rem 0 0.8rem 0 rgba(0, 0, 0, 1);
  display: grid;
  grid-template: 1fr 1fr 1fr/ 1fr 1fr 1fr;
  margin: auto;
  border: solid black 0.5rem;
`;

const HandContainer = styled.div`
  margin: auto;
  width: fit-content;
  height: fit-content;
  grid-area: ${({ row, column }) => `${row} / ${column} / span 1 / span 1`};
  rotate: ${({ rotate }) => `${rotate}deg`};
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
`;

const CoinStackContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const CardStackContainer = styled.div`
  grid-area: ${({ row, column }) => `${row} / ${column} / span 1 / span 1`};
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-bottom: 2rem;
`;


function PlayerHand(props) {
  let { playerCoins, playerHand } = props.playerHand;

  return (
    <HandContainer row={props.row} column={props.column} rotate={props.rotate}>
      <CoinStackContainer>
        <CoinStack zIndex={props.fixZIndex ? 4 : 0} rotate={-props.rotate} amount={playerCoins.black} color={'black'} />
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
      <Hand cards={playerHand} />
    </HandContainer>
  );
}

function TableMiddle(props) {

  return (
    <MiddleContainer row={props.row} column={props.column}>
      <CoinStackContainer>
        <CoinStack amount={props.coinStack.black} color={'black'} />
        <CoinStack amount={props.coinStack.darkblue} color={'darkblue'} />
        <CoinStack amount={props.coinStack.darkgreen} color={'darkgreen'} />
        <CoinStack amount={props.coinStack.darkred} color={'darkred'} />
      </CoinStackContainer>
      <CardRiverContainer>
        <CardRiver
          cards={props.cardRiver}
        />
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
 * 
 * @returns The Table UI
 */

export default function Table(props) {
  
  return (
    <TableContainer>
      <CardStackContainer row={1} column={1}>
        <CardStack cards={props.cardStack} />
      </CardStackContainer>
      <PlayerHand row={3} column={2} rotate={0} playerHand={props.players[0]} />
      <PlayerHand row={2} column={1} rotate={90} playerHand={props.players[1]} />
      <PlayerHand row={1} column={2} rotate={180} playerHand={props.players[2]} />
      <PlayerHand row={2} column={3} rotate={270} playerHand={props.players[3]} fixZIndex={true} />
      <TableMiddle row={2} column={2} cardRiver={props.cardRiver} coinStack={props.coinStack} />
    </TableContainer>
  );
}
