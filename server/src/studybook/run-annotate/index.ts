import { VM } from 'vm2'
import { annotate } from '../annotate';
import { createModelerProxy } from '../modeler';
import { IOperationsMemo } from '../modeler/interfaces';
import { prologue } from '../prologue'

export const dashToCamel = (str: string) =>
  str
    .split("-")
    .reduce(
      (acc: string, word: string, i: number) =>
        `${acc}${i === 0 ? word : `${word[0].toUpperCase()}${word.slice(1)}`}`,
      ""
    );

export interface IAnnotationTemplateParams {
  code: string;
  funcToRun: string;
}
const annotationTemplate = ({ code, funcToRun }: IAnnotationTemplateParams) => `
${code}

const result = scope().${funcToRun}(
  array
);
`;

const buildNoop: () => () => void = () => () => { return undefined }

export const runAnnotate = (code: string, funcToRun: string) => {
  const memo: IOperationsMemo = {
    events: []
  };
  const { scope } = createModelerProxy(buildNoop(), memo, { name: 'scope'});

  const testArray = [5,4,3,2,1];
  const { scope: array } = createModelerProxy(() => testArray, memo, { name: 'array', value: testArray });

  const vm = new VM({ sandbox: {
    compiler: 'javascript',
    scope,
    createModelerProxy,
    array,
    memo
  }, timeout: 1000 })

  const annotatedCode = annotationTemplate({
    code: annotate({ code }),
    funcToRun
  });

  vm.run(annotatedCode);

  return memo;
};
