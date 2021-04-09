import React, { useEffect, useState } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import { StyledEditor } from './editor.style';
import { convertSelection } from './helpers'
import { ILocation } from '../../interfaces';
require('codemirror/mode/javascript/javascript');

export interface IEditor {
  value: string;
  onChange: () => void;
  selection: ILocation;
}

export const Editor: React.FC<IEditor> = ({ value, onChange, selection, ...props }) => {
  const [editor, updateEditor] = useState();
  
  useEffect(() => {
    if (editor && selection) {
      (editor as any).setSelection(...convertSelection(selection))
    }
  }, [selection, editor])

  return <StyledEditor data-testid="editor" {...props}>
    <CodeMirror
      value={value} 
      onBeforeChange={onChange} 
      options={{
        mode: 'javascript',
        readonly: true
      }}
      editorDidMount={editor => { updateEditor(editor) }}
    />
  </StyledEditor>
}