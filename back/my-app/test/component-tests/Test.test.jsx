import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'mobx-react';
import Test from '../../src/components/Test';
import { DemoStore } from '../../src/stores/demo.store';

describe('Test Component', () => {
  let demoStore: DemoStore;

  beforeEach(() => {
    demoStore = new DemoStore();
  });

  it('renders initial state', () => {
    render(
      <Provider demoStore={demoStore}>
        <Test />
      </Provider>
    );

    expect(screen.getByText('MobX API Demonstration')).toBeInTheDocument();
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    expect(screen.getByText('Double Count (Computed): 0')).toBeInTheDocument();
  });

  it('handles increment button click', () => {
    render(
      <Provider demoStore={demoStore}>
        <Test />
      </Provider>
    );

    fireEvent.click(screen.getByText('Increment'));

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
    expect(screen.getByText('Double Count (Computed): 2')).toBeInTheDocument();
  });

  it('handles decrement button click', () => {
    render(
      <Provider demoStore={demoStore}>
        <Test />
      </Provider>
    );

    fireEvent.click(screen.getByText('Decrement'));

    expect(screen.getByText('Count: -1')).toBeInTheDocument();
  });

  it('updates name via input field', () => {
    render(
      <Provider demoStore={demoStore}>
        <Test />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter name');
    fireEvent.change(input, { target: { value: 'New Name' } });

    expect(demoStore.name).toBe('New Name');
  });

  it('adds a new todo', () => {
    render(
      <Provider demoStore={demoStore}>
        <Test />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add Todo'));

    expect(screen.getByText('Total Todos: 1')).toBeInTheDocument();
  });

  it('toggles todo completion', () => {
    render(
      <Provider demoStore={demoStore}>
        <Test />
      </Provider>
    );

    // Add a todo first
    fireEvent.click(screen.getByText('Add Todo'));
    
    // Find the complete button for the added todo
    const completeButton = screen.getByText('Complete');
    fireEvent.click(completeButton);

    expect(screen.getByText('Completed Todos: 1')).toBeInTheDocument();
  });
});