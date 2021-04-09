import React from "react";
import { StyledCodeExampleSelect, StyledCodeExampleLabel, StyledCodeExampleOption } from "./code-example-select.style";
import { ICodeExampleSelect } from "./interfaces";

export const CodeExampleSelect: React.FC<ICodeExampleSelect> = ({ onChange, options, selectedOption }) => (
  <>
    <StyledCodeExampleLabel>Choose a Code Snippet: </StyledCodeExampleLabel>
    <StyledCodeExampleSelect 
      data-testid='code-example-select' 
      onChange={e => onChange(e.target.value)}
      value={selectedOption}
    >
      {options.map((example, i) => <StyledCodeExampleOption 
          data-testid="code-example-option" 
          key={i} 
          value={example}
        >{
        example
        }</StyledCodeExampleOption>
      )}
    </StyledCodeExampleSelect>
  </>
)