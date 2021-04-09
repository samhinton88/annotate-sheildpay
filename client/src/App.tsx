import { useState } from 'react';
import { GlobalLayout, EditorSection } from './components/layout'
import { Log } from './components/log'
import { LogLine } from './components/log-line'
import { Editor } from './components/editor'
import { CodeExampleSelect } from './components/code-example-select'
import { RunCodeButton } from './components/buttons'
import axios, { AxiosError } from 'axios';
import './App.css';
import { ifElse, sumWithBasicForLoop, whatHappensWhenYouCompareAnArray, insertionSort } from './code-data'
import { IAnnotation, ILocation } from './interfaces';
import { ErrorBase } from './components/error-base';
import { API_ROOT } from './config';

interface ICodeExamples {
  [key: string]: string;
}

const codeExamples: ICodeExamples = {
  sumWithBasicForLoop,
  ifElse,
  whatHappensWhenYouCompareAnArray,
  insertionSort
}

function App() {
  const [annotations, updateAnnotations] = useState<IAnnotation[]>([]);
  const [fetchError, updateFetchError] = useState<AxiosError | null>(null);
  const [codeStep, updateCodeStep] = useState<number | null>(null)
  const [selectionIndex, updateSelectionIndex] = useState<number | null>(null);
  const [codeExample, updateCodeExample] = useState('ifElse')

  const resetState = () => {
    updateAnnotations([]);
    updateFetchError(null);
    updateCodeStep(null);
    updateSelectionIndex(null)
  }

  const fetchAnnotation = async () => {
    try {
      const res = await axios.post(`${API_ROOT}/annotate`, { code: codeExamples[codeExample], funcToRun: codeExample });
      updateAnnotations(res.data.events.slice(2));
    } catch (error) {
      updateFetchError(error)
    }
  }
  const currentlySelectedAnnotation = selectionIndex !== null ? annotations[selectionIndex] : null;

  const currentSelectionLocation: ILocation = 
    currentlySelectedAnnotation ? currentlySelectedAnnotation.loc : { 
      start: { column: 0, line: 0 },
      end: { column: 0, line: 0 },
    }

  return (
    <GlobalLayout>
      <EditorSection>
        <h2>Welcome to Annotate!</h2>
        <p>Take algorithms in baby steps.</p>
        <div>
          <CodeExampleSelect 
            options={Object.keys(codeExamples)} 
            onChange={value => {
              resetState()
              updateCodeExample(value);
            }}
            selectedOption={codeExample}></CodeExampleSelect>
        </div>
        <Editor 
          value={codeExamples[codeExample]} 
          onChange={() => {}} 
          selection={currentSelectionLocation}>
        </Editor>
        <div>
          <RunCodeButton onClick={() => {
              if (annotations.length === 0) {
                fetchAnnotation()
              }
              updateCodeStep(null)
            }}>Run All</RunCodeButton>
            <RunCodeButton onClick={() =>{
              if (annotations.length === 0) {
                fetchAnnotation();
              }
              const nextStep = codeStep === null ? 1 : (
                codeStep === annotations.length ? 1 : codeStep + 1
              )
              updateCodeStep(nextStep);
              updateSelectionIndex(nextStep - 1); // zero indexed
              }}>Step Through Code</RunCodeButton>
        </div>
      </EditorSection>
      <Log>
        {fetchError ? (
          <ErrorBase><h3>Oops!</h3>
          <p>It looks like something went wrong.</p>
          <button
            onClick={resetState}
          >Reset</button>
          </ErrorBase>
        ): 
        annotations.slice(0, codeStep === null ? annotations.length : codeStep).map(({ type, key, message, loc, returnValue, value }, i) => {
          return <LogLine 
            key={i} 
            methodKey={key}
            setValue={value} 
            active={selectionIndex === i}
            loc={loc}
            methodType={type}
            returnValue={returnValue}
            message={message}
            onClick={() => {
              updateSelectionIndex(i);
            }}/>
        })}
      </Log>
    </GlobalLayout>
  );
}

export default App;
