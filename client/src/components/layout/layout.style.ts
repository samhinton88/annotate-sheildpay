import styled from 'styled-components'

export const StyledGlobalLayout = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (min-width: 500px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
  }

`;

export const StyledEditorSection = styled.div`
  width: 350px;
  div {
    margin-bottom: 15px;
  }
  
`;