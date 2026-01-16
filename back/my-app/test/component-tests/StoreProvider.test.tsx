import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider } from '../../src/contexts/StoreProvider';
import { useStore } from '../../src/stores';

// Simple test component that uses the store
const TestConsumer = () => {
  const { counterStore } = useStore();
  return <div>Count: {counterStore.count}</div>;
};

describe('StoreProvider', () => {
  it('provides stores to child components', () => {
    render(
      <StoreProvider>
        <TestConsumer />
      </StoreProvider>
    );

    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
});