import React from 'react';
import { StyledGlobalLayout, StyledEditorSection } from './layout.style';

export const GlobalLayout: React.FC = (props) =>  <StyledGlobalLayout {...props} />

export const EditorSection: React.FC = (props) => <StyledEditorSection {...props} />