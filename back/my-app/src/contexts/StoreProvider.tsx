// src/contexts/StoreProvider.tsx
import React, { createContext, ReactNode } from 'react';
import { rootStore, StoreContext } from '../stores';

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
};