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
      <FirstSpan>Lv. {level}</FirstSpan>
      <SecondSpan>{percentStr}</SecondSpan>
    </CharDesc>
  );
}

const CharDesc = styled.div`
  display: flex;
  flex-direction: column;
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
`;

const FirstSpan = styled.span`
  font-size: 2rem;
`
const SecondSpan = styled.span`
  font-size: 1.5rem;
`