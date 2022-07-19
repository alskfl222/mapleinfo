import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { io } from 'socket.io-client';
import { inputState, typeState, charState } from '../store';

const socket = io('http://localhost:4004/mapleinfo');

export default function ControllerDetail() {
  const [input, setInput] = useRecoilState(inputState);
  const [char, setChar] = useRecoilState(charState);
  const [type, setType] = useRecoilState(typeState);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.emit('getViewState');
    socket.on('setViewState', (data) => {
      setChar(data.char);
      setType(data.type);
    });
    return () => {
      socket.off('connect');
      socket.off('setViewState');
    };
  }, []);

  useEffect(() => {
    // if (type !== 'stat') {
    socket.emit('changeType', { type });
    // setTimeout(() => {
    //   socket.emit('changeType', { type: 'stat' });
    //   setType('stat');
    // }, 5000);
    // }
  }, [type]);

  useEffect(() => {
    if (input.length > 2) {
      socket.emit('changeChar', { char: input });
    }
  }, [char]);

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
      <button onClick={changeTypeChange}>변경</button>
    </div>
  );
}
