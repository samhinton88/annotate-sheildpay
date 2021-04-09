import { parse } from '@babel/parser'

const parser = (code: string) => {
  return { ast: parse(code), source: code };
};

export interface IPrologueParams {
  code: string;
  funcToRun: string;
}
export type IPrologue = (params: IPrologueParams) => any;
export const prologue: IPrologue = ({ code, funcToRun }) => {
  const { ast } = parser(code);

  const { comments } = ast;

  if (!comments) return {};

  const prologueInstruction = comments.find(c => c.value.includes(funcToRun));

  if (!prologueInstruction) return {};

  const paramData = prologueInstruction.value.split('\n').slice(2).reduce((acc, line) => {
    const [key, ...config] = line.split('*').slice(1).join('*').split(':');
    if (key) {
      acc[key.trim()] = config.join(':').trim();
    }
    return acc
  }, {} as any);
  return paramData;
}
