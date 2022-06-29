import { useState, useEffect } from 'react'
import { io } from "socket.io-client";

function App() {
  const [char, setChar] = useState('네리에리네')
  const socket = io('http://localhost:4004/mapleinfo')

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id)
    })
    socket.on('changeChar', (data) => {
      setChar(data.char)
    })
  }, [])

  useEffect(() => {
    console.log(char)
  }, [char])

  const changeChar = () => {
    setChar('프레아루쥬')
  }

  return (
    <div>
      client test
      <button onClick={changeChar}></button>
    </div>
  )
}

export default App
