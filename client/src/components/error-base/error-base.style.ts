import styled from 'styled-components'

export const StyledErrorBase = styled.div`
  background: rgba(250, 10, 0, 0.8);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  h3 {
    font-size: 24px;
  }

  button {
    background: white;
    height: 35px;
    width: 100px;
    border-radius: 4px;
    border: none;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    font-weight: bold;
    :hover {
      background: rgb(250, 250, 250);
    }
  }
`;