import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import CharStat from '../components/CharStat';
import CharExpChange from '../components/CharExpChange';
import { useChar } from '../hooks/useChar';
import { charState, typeState } from '../store';

const IMAGE_SERVER_URL = import.meta.env.VITE_IMAGE_SERVER_URL;
const WS_URL = import.meta.env.VITE_WS_URL;
const socket = io(`${WS_URL}/mapleinfo`);

export default function View() {
  const [char, setChar] = useRecoilState(charState);
  const [type, setType] = useRecoilState(typeState);
  const { data, isLoading, error } = useChar(char);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.on('setView', (data) => {
      if (char !== data.char) {
        setChar(data.char);
      }
      if (type !== data.type) {
        setType(data.type);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('setView');
    };
  }, []);

  if (error) {
    return (
      <Background>
        <Container>
          <Message>RETRY...</Message>
        </Container>
      </Background>
    );
  }
  if (isLoading) {
    return (
      <Background>
        <Container>
          <Message>LOADING...</Message>
        </Container>
      </Background>
    );
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

const Message = styled.span`
  width: 100%;
  text-align: center;
`;

const CharImg = styled.img`
  position: relative;
  top: -1.5rem;
  left: -2rem;
  z-index: 1;
  width: 360px;
  height: 360px;
`;

const CharDescContainer = styled.div`
  position: relative;
  left: -3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CharName = styled.span`
  position: relative;
  top: 0rem;
  font-size: 3rem;
`;
