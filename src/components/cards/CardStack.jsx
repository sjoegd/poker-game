import React from 'react';
import styled from 'styled-components';

import Card from './Card';

const StackContainer = styled.div`
  position: relative;
  width: 6rem;
  height: calc(1.4 * 6rem);

`;

const CardContainer = styled.div`
  position: absolute;
  left: ${({i}) => `${-i*0.025}rem`};
  top: ${({i}) => `${-i*0.05}rem`};
`;

export default function CardStack(props) {
  let cards = [];

  let i = 0
  for (let card of props.cards) {
    cards.push(
      <CardContainer i={i} key={card.number + card.type}>
        <Card number={card.number} type={card.type} backwards={card.backwards} />
      </CardContainer>
    );
    i++;
  }

  return <StackContainer>{cards}</StackContainer>;
}
