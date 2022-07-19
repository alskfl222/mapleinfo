import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { io } from 'socket.io-client';
import { inputState, typeState, charState, observerState } from '../store';

const socket = io('http://localhost:4004/mapleinfo');

export default function ControlDetail() {
  const [streamId, setStreamId] = useState('');
  const [input, setInput] = useRecoilState(inputState);
  const [char, setChar] = useRecoilState(charState);
  const [type, setType] = useRecoilState(typeState);
  const [isAlive, setIsAlive] = useRecoilState(observerState);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.emit('getViewState');
    socket.on('aliveObserverRes', () => {
      setIsAlive('true');
    });
    socket.on('stopObserverRes', () => {
      setIsAlive('false');
    });
    return () => {
      socket.off('connect');
      socket.off('setViewState');
    };
  }, []);

  useEffect(() => {
    socket.emit('changeView', { char, type });
  }, [char, type]);


  const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const changeChar = () => {
    if (input.length > 2) {
      setChar(input);
    }
  };
  const changeTypeChange = () => {
    if (type !== 'change') {
      setType('change');
    }
  };
  const changeTypeStat = () => {
    if (type !== 'stat') {
      setType('stat');
    }
  };
  const changeStreamId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreamId(e.target.value);
  };
  const initObserver = () => {
    if (isAlive !== 'true') {
      socket.emit('initObserver', { streamId });
    }
  };
  const stopObserver = () => {
    socket.emit('stopObserver');
  };
  return (
    <div>
      <input
        value={input}
        onChange={changeInput}
        placeholder='바꿀 캐릭터 이름'
      />
      <br />
      char: {char} <br />
      type: {type} <br />
      <button onClick={changeChar}>클릭</button>
      <button onClick={changeTypeStat}>스탯</button>
      <button onClick={changeTypeChange}>변경</button> <br />
      {isAlive} <br />
      <input
        value={streamId}
        onChange={changeStreamId}
        placeholder='스트림 아이디'
      />
      <button onClick={initObserver}>활성</button>
      <button onClick={stopObserver}>비활성</button>
    </div>
  );
}
