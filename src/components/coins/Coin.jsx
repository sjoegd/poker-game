import React from 'react';
import styled from 'styled-components';

// Black 100
// Blue  50
// Green 20
// Red   10

const StyledCoin = styled.svg`
  background: white;
  border-radius: 50%;
  border: 0.2rem solid;
  border-color: ${({color}) => color};
  fill: ${({color}) => color};
`

export default function Coin(props) {
  return (
    <StyledCoin color={props.color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path d="m16 11.5-3.17 3.34a1.87 1.87 0 0 0 0 2.52 1.63 1.63 0 0 0 2.34 0 .75.75 0 0 1 .15-.13.44.44 0 0 1 .43 0 .35.35 0 0 1 .19.34 6.38 6.38 0 0 1-1.15 3.09h2.42a6.38 6.38 0 0 1-1.15-3.09.35.35 0 0 1 .18-.36.4.4 0 0 1 .42 0 .7.7 0 0 1 .17.14 1.63 1.63 0 0 0 2.34 0 1.86 1.86 0 0 0 0-2.52Z" />
        <path d="M16 6.54A9.46 9.46 0 1 0 25.45 16 9.48 9.48 0 0 0 16 6.54Zm3.71 11.34a2.36 2.36 0 0 1-1.73.74 2.29 2.29 0 0 1-1-.23 5.37 5.37 0 0 0 1.3 2.39.38.38 0 0 1 .07.41.37.37 0 0 1-.34.23H14a.37.37 0 0 1-.34-.23.38.38 0 0 1 .07-.41A5.32 5.32 0 0 0 15 18.39a2.4 2.4 0 0 1-2.73-.51 2.61 2.61 0 0 1 0-3.55l3.44-3.63a.36.36 0 0 1 .54 0l3.44 3.63a2.61 2.61 0 0 1 .02 3.55Z" />
        <path d="m27.62 7.33-.42-.52-.44-.51a7.4 7.4 0 0 0-.55-.57c-.21-.21-.42-.41-.64-.59L25.41 5c-.23-.2-.48-.39-.73-.58a14.31 14.31 0 0 0-6.62-2.75 14.22 14.22 0 0 0-4.12 0 14.34 14.34 0 0 0-6.61 2.71c-.19.16-.4.31-.58.47l-.37.32a12.7 12.7 0 0 0-1.19 1.18l-.32.37c-.16.18-.31.39-.47.58a14.49 14.49 0 0 0 0 17.34c.16.19.31.4.47.58l.32.37a12.7 12.7 0 0 0 1.16 1.16l.37.32c.18.16.39.31.58.47a14.34 14.34 0 0 0 6.61 2.73c.36 0 .7.09 1 .11s.68 0 1 0h1c.31 0 .68-.06 1-.11a14.31 14.31 0 0 0 6.62-2.75c.25-.19.5-.38.73-.58l.14-.13c.22-.18.43-.38.64-.59a7.4 7.4 0 0 0 .55-.57l.44-.51.42-.52a14.49 14.49 0 0 0 0-17.34ZM16 27.47A11.47 11.47 0 1 1 27.47 16 11.49 11.49 0 0 1 16 27.47Zm0-23.95a1.62 1.62 0 0 1-1.56-1.17 13.57 13.57 0 0 1 3.12 0A1.62 1.62 0 0 1 16 3.52Zm10.76 3.93a1.63 1.63 0 0 1-1.94-.28 1.6 1.6 0 0 1-.28-1.93 14.06 14.06 0 0 1 2.22 2.21ZM7.45 5.24a1.63 1.63 0 0 1-2.21 2.21 14.43 14.43 0 0 1 2.21-2.21ZM5.24 24.55a1.63 1.63 0 0 1 2.21 2.21 14.9 14.9 0 0 1-2.21-2.21Zm9.2 5.1a1.62 1.62 0 0 1 3.12 0 14.79 14.79 0 0 1-3.12 0Zm10.1-2.89a1.6 1.6 0 0 1 .28-1.93 1.63 1.63 0 0 1 1.18-.48 1.57 1.57 0 0 1 .79.2 14.06 14.06 0 0 1-2.25 2.21Z" />
    </StyledCoin>
  );
}
