
export interface IScopeEventHandler {
  target: any;
  name: string;
  returnValue: any;
  key: string;
  loc: any;
}

export interface IScopeSetHandler extends IScopeEventHandler {
  value: any;
}

export interface IScopeSayHandler extends IScopeEventHandler {
  message: string;
}

export type IScopedOperationHandler<T> = (state: IOperationsMemo) => (context: T) => void;

export interface IModelerProps {
  name: string;
  value?: any;
  onGetMember?: IScopedOperationHandler<IScopeEventHandler>;
  onSetMember?: IScopedOperationHandler<IScopeSetHandler>;
  onSay?: IScopedOperationHandler<IScopeSayHandler>;
}

export type ICreateModelerProxy = (obj: any, memo: IOperationsMemo, props: IModelerProps) => any;

export interface IOperationsMemo {
  events: any[];
}