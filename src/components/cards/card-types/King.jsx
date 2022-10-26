import React from 'react'
import styled from 'styled-components';
import kingBlack from '/king-black.png'
import kingRed from '/king-red.png'

const StyledKing = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

function King(props) {
  return <StyledKing src={props.color == 'red' ? kingRed : kingBlack} />
}


export default King;