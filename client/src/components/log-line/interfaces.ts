import { ILocation, UnderlyingMethods } from "../../interfaces";

export interface ILogLine {
  methodType: UnderlyingMethods;
  loc: ILocation;
  active: boolean;
  onClick: () => void;
  methodKey: string;
  setValue?: any;
  returnValue?: any;
  message?: string;
}

export interface IUnderlyingMethodProps {
  method: UnderlyingMethods;
}