import { StyledEditorSection } from '../layout/layout.style'
import { StyledRunCodeButton } from './buttons.style'


interface IRunCodeButton  {
  children: React.ReactNode;
  onClick: () => void;
}
export const RunCodeButton: React.FC<IRunCodeButton> = (props) => <StyledRunCodeButton {...props}/>