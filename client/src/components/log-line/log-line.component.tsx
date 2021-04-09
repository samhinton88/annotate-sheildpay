import { useEffect, useRef } from 'react';
import { UnderlyingMethods } from '../../interfaces';
import { ILogLine } from './interfaces'
import { StyledAssignment, StyledSayMessage, StyledLogLine, StyledBracket, StyledSetValue, StyledUnderlyingMethod, StyledMethodKey, StyledReturnValue } from './log-line.style'

export const LogLine: React.FC<ILogLine> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const { methodType, methodKey, returnValue, setValue, message } = props;

  useEffect(() => {
    if (props.active) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [props])

  return <StyledLogLine ref={ref} data-testid="log-line" {...props}>
    <StyledUnderlyingMethod method={methodType}>{methodType}</StyledUnderlyingMethod>
    <StyledMethodKey>
      <StyledBracket>[</StyledBracket>
      {methodKey}
      <StyledBracket>]</StyledBracket>
    </StyledMethodKey>
    {methodType ===  UnderlyingMethods.SET &&
      <StyledSetValue>
        <StyledAssignment>=</StyledAssignment> {JSON.stringify(setValue)}</StyledSetValue>}
    {methodType ===  UnderlyingMethods.GET &&
      <StyledReturnValue>{'->'}{JSON.stringify(returnValue)}</StyledReturnValue>}
    {methodType ===  UnderlyingMethods.SAY &&
      <StyledSayMessage>{message}</StyledSayMessage>}
  </StyledLogLine>
}