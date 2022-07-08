import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import CharStat from '../components/CharStat';
import CharExpChange from '../components/CharExpChange';
import { useChar } from '../hooks/useChar';
import { charState, typeState } from '../store';

const IMAGE_SERVER_URL = import.meta.env.VITE_IMAGE_SERVER_URL;

export default function Viewer() {
  const type = useRecoilValue(typeState);
  const char = useRecoilValue(charState);
  const { data, isLoading, error } = useChar(char);

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
    <Container>
      <CharImg src={imageUrl} alt='image' />
      <CharName>{name}</CharName>
      {type === 'stat' && <CharStat char={char} type={type}></CharStat>}
      {type === 'change' && (
        <CharExpChange char={char} type={type}></CharExpChange>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  z-index: 1;
  width: 360px;
  height: 360px;
  display: flex;
  justify-content: center;
  background-color: #ccc;
  color: white;
  font-weight: 700;
  text-shadow: 0px 0px 4px black;
  overflow: hidden;
`;

const CharImg = styled.img`
  position: relative;
  top: -4rem;
  width: 100%;
`;

const CharName = styled.span`
  position: absolute;
  bottom: 6rem;
  font-size: 2rem;
`;
