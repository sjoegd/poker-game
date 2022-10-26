import React from 'react'
import styled from 'styled-components';

import Coin from './Coin'

const StackContainer = styled.div`
    position: relative;
    height: 4rem;
    width: 4rem;
    rotate: ${({rotate}) => `${rotate}deg`};
    margin: 0 0.25rem;
`

const CoinContainer = styled.div`
    width: 4rem;
    position: absolute;
    left: ${({i}) => `${-i*0.04}rem`};
    top: ${({i}) => `${-i*0.24}rem`};
`

export default function CoinStack(props) {
  let coins = [];

  for(let i = 0; i < props.amount; i++) {
    coins.push(<CoinContainer i={i}><Coin color={props.color} /></CoinContainer>)
  }

  return (
    <StackContainer rotate={props.rotate} amount={props.amount}>{coins}</StackContainer>
  )
}
