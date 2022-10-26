import React from 'react';
import styled from 'styled-components';

import Card from './Card';

const CardWrapper = styled.div`
  width: fit-content;
  display: flex;
`;

export default function Hand(props) {
  let [card_1, card_2] = props.cards;
  return (
    <CardWrapper>
      <Card number={card_1.number} type={card_1.type} backwards={card_1.backwards} />
      <Card number={card_2.number} type={card_2.type} backwards={card_2.backwards} />
    </CardWrapper>
  );
}
