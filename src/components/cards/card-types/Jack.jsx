import React from 'react'
import styled from 'styled-components';
import jackBlack from '/jack-black.png'
import jackRed from '/jack-red.png'

const StyledJack = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

function Jack(props) {
  return <StyledJack src={props.color == 'red' ? jackRed : jackBlack} />
}


export default Jack;