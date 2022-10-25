import React from 'react';
import styled from 'styled-components';

import Spade from './types/Spade';
import Club from './types/Club';
import Diamond from './types/Diamond';
import Heart from './types/Heart';

import King from './types/King';
import Queen from './types/Queen';
import Jack from './types/Jack';

import cardBack from '/cardback.png';

const Container = styled.div`
  width: 6rem;
  height: calc(6rem * 1.4);
  background: white;
  border: solid 0.04rem black;
  border-radius: 0.5rem;
  display: grid;
  grid-template: 1fr / 0.175fr 1fr 0.175fr;
  margin: 0.125rem;
  overflow: hidden;
`;

const Value = styled.div`
  color: ${({ color }) => color};
  font-size: 1.15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopValue = styled(Value)`
  grid-area: 1 / 1 / 1 / 1;
`;

const BottomValue = styled(Value)`
  height: 100%;
  grid-area: 1 / 3 / 1 / 3;
  rotate: 180deg;
`;

const MiddleContainer = styled.div`
  grid-area: 1 / 2 / 1 / 2;
  display: grid;
  grid-template: repeat(8, 1fr) / repeat(3, 1fr);
`;

const TypeWrapper = styled.div`
  grid-area: ${props => `${props.row} / ${props.column} / span 2 / span 1`};
  display: flex;
  align-items: center;
  rotate: ${({ rotated }) => (rotated ? '180deg' : '')};
`;

const RoyalWrapper = styled.div`
  grid-area: 1 / 1 / span 8 / span 3;
`;

const Backwards = styled.div`
  grid-area: 1 / 1 / span 8 / span 3;
  background-image: url(${cardBack});
  background-size: cover;
  background-color: black;
`;

function Top(props) {
  let color = ['spade', 'club'].includes(props.type) ? 'black' : 'red';
  return (
    <TopValue color={color}>
      {props.number}
      <Type type={props.type} color={color} />
    </TopValue>
  );
}

function Bottom(props) {
  let color = ['spade', 'club'].includes(props.type) ? 'black' : 'red';
  return (
    <BottomValue color={color} fill={color}>
      {props.number}
      <Type type={props.type} color={color} />
    </BottomValue>
  );
}

function Type(props) {
  switch (props.type) {
    case 'spade':
      return <Spade color={props.color} />;
    case 'heart':
      return <Heart color={props.color} />;
    case 'club':
      return <Club color={props.color} />;
    case 'diamond':
      return <Diamond color={props.color} />;
  }
}

function Middle(props) {
  let color = ['spade', 'club'].includes(props.type) ? 'black' : 'red';
  return <MiddleContainer>{getMiddleChildren({ ...props, color })}</MiddleContainer>;
}

function getMiddleChildren(props) {
  switch (props.number) {
    case 'J':
    case 'Q':
    case 'K':
      return <MiddleRoyal color={props.color} type={props.type} number={props.number} />;
    case 'A':
      return (
        <>
          <MiddleType color={props.color} type={props.type} row={4} column={2} />
        </>
      );
    case 2:
      return (
        <>
          <MiddleType color={props.color} type={props.type} row={1} column={2} />
          <MiddleType color={props.color} type={props.type} row={7} column={2} rotated={true} />
        </>
      );
    case 3:
      return (
        <>
          <MiddleType color={props.color} type={props.type} row={1} column={2} />
          <MiddleType color={props.color} type={props.type} row={4} column={2} />
          <MiddleType color={props.color} type={props.type} row={7} column={2} rotated={true} />
        </>
      );
    case 4:
      return (
        <>
          <MiddleType color={props.color} type={props.type} row={1} column={1} />
          <MiddleType color={props.color} type={props.type} row={7} column={1} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={1} column={3} />
          <MiddleType color={props.color} type={props.type} row={7} column={3} rotated={true} />
        </>
      );
    case 5:
      return (
        <>
          <MiddleType color={props.color} type={props.type} row={1} column={1} />
          <MiddleType color={props.color} type={props.type} row={7} column={1} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={4} column={2} />
          <MiddleType color={props.color} type={props.type} row={1} column={3} />
          <MiddleType color={props.color} type={props.type} row={7} column={3} rotated={true} />
        </>
      );
    case 6:
      return (
        <>
          <MiddleType color={props.color} type={props.type} row={1} column={1} />
          <MiddleType color={props.color} type={props.type} row={4} column={1} />
          <MiddleType color={props.color} type={props.type} row={7} column={1} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={1} column={3} />
          <MiddleType color={props.color} type={props.type} row={4} column={3} />
          <MiddleType color={props.color} type={props.type} row={7} column={3} rotated={true} />
        </>
      );
    case 7:
      return (
        <>
          <MiddleType color={props.color} type={props.type} row={1} column={1} />
          <MiddleType color={props.color} type={props.type} row={4} column={1} />
          <MiddleType color={props.color} type={props.type} row={7} column={1} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={3} column={2} />
          <MiddleType color={props.color} type={props.type} row={1} column={3} />
          <MiddleType color={props.color} type={props.type} row={4} column={3} />
          <MiddleType color={props.color} type={props.type} row={7} column={3} rotated={true} />
        </>
      );
    case 8:
      return (
        <>
          <MiddleType color={props.color} type={props.type} row={1} column={1} />
          <MiddleType color={props.color} type={props.type} row={3} column={1} />
          <MiddleType color={props.color} type={props.type} row={5} column={1} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={7} column={1} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={1} column={3} />
          <MiddleType color={props.color} type={props.type} row={3} column={3} />
          <MiddleType color={props.color} type={props.type} row={5} column={3} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={7} column={3} rotated={true} />
        </>
      );
    case 9:
      return (
        <>
          <MiddleType color={props.color} type={props.type} row={1} column={1} />
          <MiddleType color={props.color} type={props.type} row={3} column={1} />
          <MiddleType color={props.color} type={props.type} row={5} column={1} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={7} column={1} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={2} column={2} />
          <MiddleType color={props.color} type={props.type} row={1} column={3} />
          <MiddleType color={props.color} type={props.type} row={3} column={3} />
          <MiddleType color={props.color} type={props.type} row={5} column={3} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={7} column={3} rotated={true} />
        </>
      );
    case 10:
      return (
        <>
          <MiddleType color={props.color} type={props.type} row={1} column={1} />
          <MiddleType color={props.color} type={props.type} row={3} column={1} />
          <MiddleType color={props.color} type={props.type} row={5} column={1} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={7} column={1} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={2} column={2} />
          <MiddleType color={props.color} type={props.type} row={6} column={2} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={1} column={3} />
          <MiddleType color={props.color} type={props.type} row={3} column={3} />
          <MiddleType color={props.color} type={props.type} row={5} column={3} rotated={true} />
          <MiddleType color={props.color} type={props.type} row={7} column={3} rotated={true} />
        </>
      );
  }
}

function MiddleType(props) {
  return (
    <TypeWrapper row={props.row} column={props.column} rotated={props.rotated}>
      <Type type={props.type} color={props.color} />
    </TypeWrapper>
  );
}

function MiddleRoyal(props) {
  function getRoyal({ number }) {
    switch (number) {
      case 'K':
        return <King color={props.color} />;
      case 'Q':
        return <Queen color={props.color} />;
      case 'J':
        return <Jack color={props.color} />;
    }
  }

  return <RoyalWrapper>{getRoyal(props)}</RoyalWrapper>;
}

export default function Card(props) {
  return (
    <Container>
      {props.backwards ? (
        <Backwards />
      ) : (
        <>
          <Top number={props.number} type={props.type} />
          <Middle number={props.number} type={props.type} />
          <Bottom number={props.number} type={props.type} />
        </>
      )}
    </Container>
  );
}
