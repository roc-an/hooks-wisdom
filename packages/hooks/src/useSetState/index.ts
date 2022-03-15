import { useCallback, useState } from 'react';
import { isFunction } from '../utils';

export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null),
) => void;

// useSetState 支持函数式更新，通过对象解构赋值将计算后的新 state 扩充到旧 state 中
const useSetState = <S extends Record<string, any>>(
  initialState: S | (() => S),
): [S, SetState<S>] => {
  const [state, setState] = useState<S>(initialState);

  // 支持函数式更新，接收先前的 state，返回一个更新后的值
  const setMergeState = useCallback((patch) => {
    setState((prevState) => {
      const newState = isFunction(patch) ? patch(prevState) : patch;
      return newState ? { ...prevState, ...newState } : prevState;
    });
  }, []);

  return [state, setMergeState];
};

export default useSetState;
