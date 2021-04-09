export interface ICodeExampleSelect {
  onChange: (s: string) => void;
  options: string[];
  selectedOption: string;
}