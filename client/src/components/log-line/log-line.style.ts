import styled, { css } from 'styled-components'
import { ILogLine, IUnderlyingMethodProps } from './interfaces';

export const StyledLogLine = styled.div<ILogLine>`
  background: grey;
  font-size: 14px;
  height: 35px;
  margin-bottom: 5px;
  display: flex;
  padding: 5px;
  border-radius: 2px;
  align-items: center;
  ${({ methodType }: { methodType: string }) => ({
    get: css`background: rgba(100, 200, 100, 0.5);`,
    set: css`background: rgba(100, 100, 200, 0.5);`,
    say: css`background: lightblue;`
  })[methodType]}
  ${({ active }: { active: boolean }) => {
    return active ? css`outline: none;
      border-color: hotpink;
      border-width: 2px;
      box-shadow: 0 0 10px hotpink;`: '' 
  }}
  width: 250px;
  transition: .3s;
`;

export const StyledSayMessage = styled.span`

`;

export const StyledUnderlyingMethod = styled.div<IUnderlyingMethodProps>`
  padding: 5px;
  border: 1px solid white;
  border-radius: 50%;
  height: 12px;
  width: 12px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
`;

export const StyledBracket = styled.span`
  color: white;
  font-weight: bold;
`;

export const StyledMethodKey = styled.div`
  margin-left: 3px;
`;

export const StyledReturnValue = styled.div`

`;

export const StyledSetValue = styled.div`

`;

export const StyledAssignment = styled.span`
  font-weight: bold;
`;