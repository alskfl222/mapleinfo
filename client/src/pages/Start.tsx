import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4004/mapleinfo');

export default function Start() {
  // lqT9PijAHUk
  const [input, setInput] = useState('');
  const [isAlive, setIsAlive] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.on('aliveObserverRes', () => {
      console.log('alive!');
      setIsAlive(true);
    });
    socket.on('stopObserverRes', () => {
      console.log('stop!');
      setIsAlive(false);
    });
    return () => {
      socket.off('connect');
    };
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const inputStreamId = () => {
    if (input.length > 0) {
      socket.emit('initObserver', { streamId: input });
    }
  };
  const stopObserver = () => {
    socket.emit('stopObserver', () => {
      console.log('stopObserver');
      setIsAlive(false);
    });
  };

  return (
    <div>
      Start
      <input type='text' value={input} onChange={onInputChange} />
      <button onClick={inputStreamId}>입력</button>
      <button onClick={stopObserver}>멈춤</button>
      <br />
      {isAlive.toString()}
    </div>
  );
}
