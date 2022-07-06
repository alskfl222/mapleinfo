import styled from 'styled-components';
import { useCharDesc } from '../hooks/useChar';
import { convertNumToStr, convertPerToStr } from '../utils';

export default function CharExpChange(props: { char: string; type: string }) {
  const { char, type } = props;
  const { data, isLoading, error } = useCharDesc(char, type);
  if (error) {
    console.log(error);
    return (
      <CharDesc>
        <span>ERROR</span>
      </CharDesc>
    );
  }
  if (isLoading) {
    return (
      <CharDesc>
        <span>LOADING...</span>
      </CharDesc>
    );
  }
  const { expChange, expPerChange } = data;
  const expStr = convertNumToStr(expChange);
  const percentStr = convertPerToStr(expPerChange);
  return (
    <CharDesc>
      <span>{percentStr}</span>
      <span>{expStr}</span>
    </CharDesc>
  );
}

const CharDesc = styled.div`
  position: absolute;
  bottom: 4.5rem;
  display: flex;
  gap: 1rem;
  /* animation: name duration timing-function delay iteration-count direction fill-mode; */
  animation-name: appear-in-out;
  animation-duration: .5s;
  animation-direction: normal;
  animation-timing-function: ease-in-out;

  @keyframes appear-in-out {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  span {
    font-size: 1.2rem;
  }
`;