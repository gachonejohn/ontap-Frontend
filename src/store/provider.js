import { makeStore } from '../store/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';

export function ReduxProvider({ children }) {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
