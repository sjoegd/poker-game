import React from 'react'
import Card from './components/Card'

export default function App() {
  return (
    <>
      <Card number={'K'} type={'spade'} />
      <Card number={'Q'} type={'club'}  />
      <Card number={'A'} type={'club'}  />
      <Card number={'J'} type={'club'}  />
    </>
  )
}

