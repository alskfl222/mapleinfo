import styled from 'styled-components';
import { useCharDesc } from '../hooks/useChar';
import FadeDiv from './common/FadeDiv';
import { convertNumToStr, convertPerToStr } from '../utils';

export default function CharExpChange(props: { char: string; type: string }) {
  const { char, type } = props;
  const { data, isLoading, error } = useCharDesc(char, type);
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
  const { expChange, expPerChange } = data;
  const expStr = convertNumToStr(expChange);
  const percentStr = convertPerToStr(expPerChange);
  return (
    <FadeDiv>
        <FirstSpan>{percentStr}</FirstSpan>
        <SecondSpan>{expStr}</SecondSpan>
    </FadeDiv>
  );
}

const FirstSpan = styled.span`
  font-size: 2rem;
`;
const SecondSpan = styled.span`
  font-size: 1.5rem;
`;
