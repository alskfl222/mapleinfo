import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Viewer from './components/Viewer';

const socket = io('http://localhost:4004/mapleinfo');

function App() {
  const [input, setInput] = useState('');
  const [char, setChar] = useState('네리에리네');

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.on('setChar', (data) => {
      setChar(data.char);
    });
    return () => {
      socket.off('connect');
      socket.off('setChar');
    };
  }, []);

  const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const changeChar = () => {
    socket.emit('changeChar', { char: input });
  };

  return (
    <div>
      <input
        value={input}
        onChange={changeInput}
        placeholder='바꿀 캐릭터 이름'
      />{' '}
      <br />
      {input} <br />
      {char} <br />
      <button onClick={changeChar}>클릭</button>
      <Viewer char={char} />
    </div>
  );
}

export default App;
