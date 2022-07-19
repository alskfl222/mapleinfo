import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { io } from 'socket.io-client';
import { observerState } from '../store';

const socket = io('http://localhost:4004/mapleinfo');

export default function Start() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setIsAlive = useSetRecoilState(observerState);
  // lqT9PijAHUk

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.on('aliveObserverRes', () => {
      console.log('alive!');
      setIsAlive('true');
      setIsLoading(false)
      navigate('/control');
    });

    return () => {
      socket.off('connect');
      socket.off('aliveObserverRes');
    };
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const inputStreamId = () => {
    if (input.length > 0) {
      setIsLoading(true)
      socket.emit('initObserver', { streamId: input });
    }
  };

  return (
    <div>
      Start
      <input type='text' value={input} onChange={onInputChange} />
      <button onClick={inputStreamId}>입력</button>
      {isLoading && <div>Loading...</div>}
      <br />
    </div>
  );
}
