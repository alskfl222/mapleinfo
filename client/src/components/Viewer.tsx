import { useEffect } from 'react';
import styled from 'styled-components';
import { useChar } from '../hooks/useChar';

const IMAGE_SERVER_URL = import.meta.env.VITE_IMAGE_SERVER_URL;

export default function Viewer(props: { char: string, type: string }) {
  const { char } = props;
  const { data, isLoading, error } = useChar(char);
  if (error) {
    console.log(error);
    return <div>ERROR</div>;
  }
  if (isLoading) {
    return <div>LOADING...</div>;
  }
  const { name, level, exp, date } = data;
  const dateString = date.split('T')[0];
  const imageUrl = `${IMAGE_SERVER_URL}/${dateString}_${name}.png`;

  return (
    <Container>
      <CharImg src={imageUrl} alt='image' />
      <CharName>{name}</CharName>
      <CharDesc>
        <CharLv>Lv. {level}</CharLv>
        <CharExp>{exp}</CharExp>
      </CharDesc>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 360px;
  height: 360px;
  display: flex;
  justify-content: center;
`;

const CharImg = styled.img`
  width: 100%;
`

const CharName = styled.span`
  position: absolute;
  bottom: 2.4rem;
  color: white;
  font-size: 2rem;
  font-weight: 700;
  -webkit-text-stroke: 1px black;
`;

const CharDesc = styled.div`
  position: absolute;
  bottom: 1rem;
  display: flex;
  gap: 1rem;
`

const CharLv = styled.span`
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  -webkit-text-stroke: 1px black;
`

const CharExp = styled.span`

  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  -webkit-text-stroke: 1px black;
`
