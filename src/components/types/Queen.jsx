import React from 'react'
import styled from 'styled-components';
import queenBlack from '/queen-black.png'
import queenRed from '/queen-red.png'

const StyledQueen= styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

function Queen(props) {
  return <StyledQueen src={props.color == 'red' ? queenRed : queenBlack} />
}


export default Queen;