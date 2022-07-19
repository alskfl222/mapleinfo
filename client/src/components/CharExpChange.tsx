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
      <FirstSpan>{percentStr}</FirstSpan>
      <SecondSpan>{expStr}</SecondSpan>
    </CharDesc>
  );
}

const CharDesc = styled.div`
  display: flex;
  flex-direction: column;
  animation-name: appear-in-out;
  animation-duration: 0.5s;
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
`;

const FirstSpan = styled.span`
  font-size: 2rem;
`
const SecondSpan = styled.span`
  font-size: 1.5rem;
`