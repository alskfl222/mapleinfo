import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { inputState, typeState, charState } from '../store';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4004/mapleinfo');

export default function ControllerDetail() {
  const [input, setInput] = useRecoilState(inputState);
  const [type, setType] = useRecoilState(typeState);
  const [char, setChar] = useRecoilState(charState);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.on('setChar', (data) => {
      setChar(data.char);
    });
    socket.on('setType', (data) => {
      console.log(data)
      console.log(char)
      setType('change');
    });
    return () => {
      socket.off('connect');
      socket.off('setChar');
    };
  }, []);

  useEffect(() => {
    if (type !== 'stat') {
      setTimeout(() => setType('stat'), 2000);
    }
  }, [type]);

  const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const changeChar = () => {
    socket.emit('changeChar', { char: input });
  };
  const changeType = () => {
    console.log(char);
    socket.emit('changeType', { type: 'change' });
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
      <button onClick={changeType}>타입 변경</button>
    </div>
  );
}
