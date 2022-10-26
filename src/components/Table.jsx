import React from 'react';
import styled from 'styled-components';

import Hand from './cards/Hand';
import CardStack from './cards/CardStack';

import CoinStack from './coins/CoinStack';

// Card = {number: ..., type: ... backwards: ...}

const TableContainer = styled.div`
  height: 50rem;
  width: 70rem;
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

const CardStackContainer = styled(HandContainer)`
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

/**
 * TODO:
 * Split into smaller components
 *
 * @returns The Table UI
 */

export default function Table() {
  return (
    <TableContainer>
      <HandContainer row={3} column={2} rotate={0}>
        <CoinStackContainer>
          <CoinStack rotate={0} amount={2} color={'black'} />
          <CoinStack rotate={0} amount={4} color={'darkred'} />
          <CoinStack rotate={0} amount={5} color={'darkblue'} />
          <CoinStack rotate={0} amount={5} color={'darkgreen'} />
        </CoinStackContainer>
        <Hand
          cards={[
            { number: 'A', type: 'heart', backwards: true },
            { number: 2, type: 'club', backwards: true },
          ]}
        />
      </HandContainer>
      <HandContainer row={2} column={1} rotate={90}>
        <CoinStackContainer>
          <CoinStack rotate={-90} amount={2} color={'black'} />
          <CoinStack rotate={-90} amount={4} color={'darkred'} />
          <CoinStack rotate={-90} amount={5} color={'darkblue'} />
          <CoinStack rotate={-90} amount={5} color={'darkgreen'} />
        </CoinStackContainer>
        <Hand
          cards={[
            { number: 'A', type: 'heart', backwards: true },
            { number: 2, type: 'club', backwards: true },
          ]}
        />
      </HandContainer>
      <HandContainer row={1} column={2} rotate={180}>
        <CoinStackContainer>
          <CoinStack rotate={-180} amount={2} color={'black'} />
          <CoinStack rotate={-180} amount={4} color={'darkred'} />
          <CoinStack rotate={-180} amount={5} color={'darkblue'} />
          <CoinStack rotate={-180} amount={5} color={'darkgreen'} />
        </CoinStackContainer>
        <Hand
          cards={[
            { number: 'A', type: 'heart', backwards: true },
            { number: 2, type: 'club', backwards: true },
          ]}
        />
      </HandContainer>
      <HandContainer row={2} column={3} rotate={270}>
      <CoinStackContainer>
          {/* fix z-indexes*/}
          <CoinStack zIndex={4} rotate={-270} amount={2} color={'black'} />
          <CoinStack zIndex={3} rotate={-270} amount={4} color={'darkred'} />
          <CoinStack zIndex={2} rotate={-270} amount={5} color={'darkblue'} />
          <CoinStack zIndex={1} rotate={-270} amount={5} color={'darkgreen'} />
        </CoinStackContainer>
        <Hand
          cards={[
            { number: 'A', type: 'heart', backwards: true },
            { number: 2, type: 'club', backwards: true },
          ]}
        />
      </HandContainer>
      <MiddleContainer row={2} column={2}>
        <CoinStackContainer>
          <CoinStack amount={2} color={'black'} />
          <CoinStack amount={4} color={'darkblue'} />
          <CoinStack amount={8} color={'darkgreen'} />
          <CoinStack amount={16} color={'darkred'} />
        </CoinStackContainer>
        <CardStackContainer>
          <CardStack
            cards={[
              { number: 7, type: 'diamond', backwards: false },
              { number: 'K', type: 'spade', backwards: false },
              { number: 9, type: 'spade', backwards: false },
              { number: 'Q', type: 'club', backwards: false },
              { number: 9, type: 'heart', backwards: false },
            ]}
          />
        </CardStackContainer>
      </MiddleContainer>
    </TableContainer>
  );
}
