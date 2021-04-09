export interface IPoint {
  column: number;
  line: number;
}

export interface ILocation {
  start: IPoint;
  end: IPoint;
}

export interface IAnnotation {
  type: UnderlyingMethods
  key: string;
  message: string;
  loc: ILocation;
  returnValue: string;
  value: string;
}

export enum UnderlyingMethods {
  GET = 'get',
  SET = 'set',
  SAY = 'say'
}