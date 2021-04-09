import React from 'react'
import { StyledLog } from './log.style'

export const Log: React.FC = (props) => {
  return <StyledLog data-testid="log" {...props} />
}