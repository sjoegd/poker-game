import React from 'react';
import styled from 'styled-components';

import Hand from './Hand';
import CardStack from './CardStack';

// Card = {number: ..., type: ... backwards: ...}

const TableContainer = styled.div`
  height: 50rem;
  width: 70rem;
  border-radius: 50%;
  background: #35654d;
  display: grid;
  grid-template: 1fr 1fr 1fr/ 1fr 1fr 1fr;
  margin: auto;
`;

const HandContainer = styled.div`
  margin: auto;
  width: fit-content;
  height: fit-content;
  grid-area: ${({ row, column }) => `${row} / ${column} / span 1 / span 1`};
  rotate: ${({rotate}) => `${rotate}deg`};
`;

const CardStackContainer = styled(HandContainer)`
  margin: 0 auto;
 `;

export default function Table() {
  return (
    <TableContainer>
      <HandContainer row={3} column={2} rotate={0}>
        <Hand
          cards={[
            { number: 'A', type: 'heart', backwards: false},
            { number: 2, type: 'club', backwards: false },
          ]}
        />
      </HandContainer>
      <HandContainer row={2} column={1} rotate={90}>
        <Hand
          cards={[
            { number: 'A', type: 'heart', backwards: true },
            { number: 2, type: 'club', backwards: true },
          ]}
        />
      </HandContainer>
      <HandContainer row={1} column={2} rotate={180}>
        <Hand
          cards={[
            { number: 'A', type: 'heart', backwards: true },
            { number: 2, type: 'club', backwards: true },
          ]}
        />
      </HandContainer>
      <HandContainer row={2} column={3} rotate={270}>
        <Hand
          cards={[
            { number: 'A', type: 'heart', backwards: true },
            { number: 2, type: 'club', backwards: true },
          ]}
        />
      </HandContainer>
      <CardStackContainer row={2} column={2}>
        <CardStack 
            cards={[
                { number:  7,  type: 'diamond', backwards: false },
                { number: 'K', type: 'spade',   backwards: false },
                { number:  9,  type: 'spade',   backwards: false },
                { number: 'Q', type: 'heart',   backwards: false },
                { number:  9,  type: 'heart',   backwards: false },
            ]}
        />
      </CardStackContainer>
    </TableContainer>
  );
}
