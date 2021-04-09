import { _onGetMember, _onSay, _onSetMember } from "./default-handlers";
import { ICreateModelerProxy } from "./interfaces";

const _depth: string[] = [];

export const createModelerProxy: ICreateModelerProxy = (
  obj,
  memo,
  { name, value: underlyingValue, onGetMember = _onGetMember, onSetMember = _onSetMember }
) => {
  if (underlyingValue && typeof underlyingValue !== 'object') {
    throw new Error('Annotation\'s underlyingValue must be an Object or Array')
  }

  if (underlyingValue) {
    underlyingValue._depth = _depth;
    underlyingValue._isAnnotation = true;
    underlyingValue._name = name;
  }

  obj._depth = _depth;
  obj._isAnnotation = true;
  obj._name = name;

  obj._underlyingValue = underlyingValue;

  const scopeObjHandler: (config: any) => ProxyHandler<any> = (config) => ({
    get(target, key) {
      if (key === '_say') {
        return (message: string) => _onSay(memo)({ message, key, target, name, returnValue: null, ...config });
      }

      const returnValue = Reflect.get(target, key);

      if (returnValue && returnValue._underlyingValue) {
        return new Proxy(returnValue._underlyingValue, scopeObjHandler(config));
      }

      if (key in target && !(key as string).startsWith('_')) {
        onGetMember(memo)({ target, returnValue, name, key: key as string, ...config });
      }

      return returnValue;
    },
    set(target, key, value) {
      const returnValue = Reflect.set(target, key, value);

      if (!(key as string).startsWith('_')) {
        onSetMember(memo)({ target, value, key: key as string, name, returnValue: true, ...config });
      }

      return returnValue;
    },
  });



  const p = new Proxy(
    obj,
    {
      apply(target, thisArg, argArray) {
        const [config] = argArray;

        return new Proxy(target, scopeObjHandler(config));
      },

    }
  );

  return { scope: p, memo };
};
