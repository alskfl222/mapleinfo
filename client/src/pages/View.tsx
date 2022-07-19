import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import CharStat from '../components/CharStat';
import CharExpChange from '../components/CharExpChange';
import { useChar } from '../hooks/useChar';
import { charState, typeState } from '../store';

const IMAGE_SERVER_URL = import.meta.env.VITE_IMAGE_SERVER_URL;
const socket = io('http://localhost:4004/mapleinfo');

export default function View() {
  const [char, setChar] = useRecoilState(charState);
  const [type, setType] = useRecoilState(typeState);
  const { data, isLoading, error } = useChar(char);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.on('setChar', (data) => {
      setChar(data.char);
    });
    socket.on('setType', (data) => {
      setType(data.type);
    });

    return () => {
      socket.off('connect');
      socket.off('setChar');
      socket.off('setType');
    };
  }, []);

  if (error) {
    return <div>ERROR</div>;
  }
  if (isLoading) {
    return <div>LOADING...</div>;
  }
  const { name, date } = data;
  const dateString = date.split('T')[0];
  const imageUrl = `${IMAGE_SERVER_URL}/${dateString}_${name}.png`;

  return (
    <Background>
      <Container>
        <CharImg src={imageUrl} alt='image' />
        <CharDescContainer>
          <CharName>{name}</CharName>
          {type === 'stat' && <CharStat char={char} type={type}></CharStat>}
          {type === 'change' && (
            <CharExpChange char={char} type={type}></CharExpChange>
          )}
        </CharDescContainer>
      </Container>
    </Background>
  );
}

const Background = styled.div`
  position: relative;
  z-index: 1;
  width: 1920px;
  height: 1080px;
  color: white;
  font-weight: 700;
  text-shadow: 0px 0px 4px black;
  overflow: hidden;
`;

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 640px;
  height: 240px;
  display: flex;
  align-items: center;
  background-color: #555c;

`;

const CharImg = styled.img`
  position: relative;
  top: -1rem;
  left: -1rem;
  z-index: 1;
  width: 360px;
  height: 360px;
`;

const CharDescContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CharName = styled.span`
  position: relative;
  top: 0rem;
  font-size: 3rem;
`;
