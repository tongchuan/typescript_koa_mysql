import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'mobx-react';
import CounterFunction from '../../src/components/CounterFunction';
import { CounterStore } from '../../src/stores/counter.store';

describe('CounterFunction', () => {
  let counterStore: CounterStore;

  beforeEach(() => {
    counterStore = new CounterStore();
  });

  it('renders initial count', () => {
    render(
      <Provider counterStore={counterStore}>
        <CounterFunction />
      </Provider>
    );

    expect(screen.getByText('Function Component')).toBeInTheDocument();
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('increments count when plus button is clicked', () => {
    render(
      <Provider counterStore={counterStore}>
        <CounterFunction />
      </Provider>
    );

    fireEvent.click(screen.getByText('+'));

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('decrements count when minus button is clicked', () => {
    render(
      <Provider counterStore={counterStore}>
        <CounterFunction />
      </Provider>
    );

    fireEvent.click(screen.getByText('-'));

    expect(screen.getByText('Count: -1')).toBeInTheDocument();
  });
});