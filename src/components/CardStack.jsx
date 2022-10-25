import React from 'react'
import styled from 'styled-components';

import Card from './Card';

const CardWrapper = styled.div`
  width: fit-content;
  display: flex;
`;

export default function CardStack(props) {
  let cards = []

  for(let card of props.cards) {
    cards.push(<Card number={card.number} type={card.type} backwards={card.backwards} />)
  }

  return (
    <CardWrapper>
        {cards}
    </CardWrapper>
  )
}
