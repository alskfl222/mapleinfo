import styled from 'styled-components';
import { useChar } from '../hooks/useChar';
import { convertPerToStr } from '../utils';

export default function CharStat(props: { char: string; type: string }) {
  const { char } = props;
  const { data } = useChar(char);
  const { level, exp_per } = data;
  const percentStr = convertPerToStr(exp_per);

  return (
    <CharDesc>
      <span>Lv. {level}</span>
      <span>{percentStr}</span>
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