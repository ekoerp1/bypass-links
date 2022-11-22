import { createContext } from 'react';

export interface IDynamicContext {
  location: {
    push: (url: string) => void;
    query: () => string;
    goBack: () => void;
  };
  storage: {
    get: <T>(key: string) => Promise<T | null | undefined>;
    set: (key: string, data: any) => Promise<void>;
  };
}

const DynamicContext = createContext<IDynamicContext>({
  location: {
    push: () => undefined,
    query: () => '',
    goBack: () => undefined,
  },
  storage: {
    get: () => Promise.resolve({} as any),
    set: () => Promise.resolve(),
  },
});

export default DynamicContext;
