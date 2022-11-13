import React, {useState} from 'react';
import Game from './components/Game';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

  :root {
    font-size: 1.4vmin;
  }

  body {
    margin: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(50, 50, 50)
  }
`

let data = []

export default function App() {
  let [currentGame, setCurrentGame] = useState(createNewGame())

  function createNewGame() {
    return <Game key={new Date().getTime()} updateData={(dat) => {data.push(...dat); console.log(data)}} createNewGame={() => {setCurrentGame(createNewGame())}} />
  }

  return (
    <>
      <GlobalStyle />
      {currentGame}
    </>
  );
}

