import { IScopedOperationHandler, IScopeEventHandler, IScopeSayHandler, IScopeSetHandler } from "./interfaces";

export const _onGetMember: IScopedOperationHandler<IScopeEventHandler> = (state) => ({ target, name, returnValue, key, loc }: IScopeEventHandler) => {
  const scopeName = target._depth[target._depth.length - 1];
  const indent = '\t'.repeat(target._depth.length);
  const objName = name ? `[${name}] ` : '';
  const sName = scopeName ? `${scopeName}` : '';

  state.events.push({ indent, scopeName, scopeStack: target._depth,  targetName: objName, returnValue, key, type: 'get', loc })
};

export const _onSetMember: IScopedOperationHandler<IScopeSetHandler> = (state) => ({ target, name, key, value, loc }: IScopeSetHandler) => {
  const scopeName = target._depth[target._depth.length - 1];
  const indent = '\t'.repeat(target._depth.length);
  const objName = name ? `[${name}] ` : '';
  const sName = scopeName ? `${scopeName}` : '';

  state.events.push({indent, scopeName, scopeStack: target._depth,  targetName: objName, value, key, loc, type: 'set'})
};

export const _onSay: IScopedOperationHandler<IScopeSayHandler> =  (state) => ({ target, name, message, loc }: IScopeSayHandler) => {
  const scopeName = target._depth[target._depth.length - 1];
  const indent = '\t'.repeat(target._depth.length);
  const objName = name ? `[${name}] ` : '';
  const sName = scopeName ? `${scopeName}` : '';

  state.events.push({indent, scopeName, scopeStack: target._depth, message, loc, type: 'say' });
};