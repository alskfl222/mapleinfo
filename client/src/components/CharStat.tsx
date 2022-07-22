import styled from 'styled-components';
import { useChar } from '../hooks/useChar';
import FadeDiv from './common/FadeDiv';
import { convertPerToStr } from '../utils';

export default function CharStat(props: { char: string; type: string }) {
  const { char } = props;
  const { data, isLoading, error } = useChar(char);

  if (error) {
    return (
      <FadeDiv>
        <span>RETRY...</span>
      </FadeDiv>
    );
  }
  if (isLoading) {
    return (
      <FadeDiv>
        <span>LOADING...</span>
      </FadeDiv>
    );
  }

  const { level, exp_per } = data;
  const percentStr = convertPerToStr(exp_per);
  
  return (
    <FadeDiv>
      <FirstSpan>Lv. {level}</FirstSpan>
      <SecondSpan>{percentStr}</SecondSpan>
    </FadeDiv>
  );
}

const FirstSpan = styled.span`
  font-size: 2rem;
`
const SecondSpan = styled.span`
  font-size: 1.5rem;
`