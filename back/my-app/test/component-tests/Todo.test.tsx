import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'mobx-react';
import Todo from '../../src/components/Todo';
import { TodoStore } from '../../src/stores/todo.store';
import { Todo as TodoModel } from '../../src/models/todo.model';

describe('Todo', () => {
  let todoStore: TodoStore;

  beforeEach(() => {
    todoStore = new TodoStore();
  });

  it('renders initial state', () => {
    render(
      <Provider todoStore={todoStore}>
        <Todo />
      </Provider>
    );

    expect(screen.getByText('Todos (0)')).toBeInTheDocument();
  });

  it('adds a new todo when button is clicked', () => {
    render(
      <Provider todoStore={todoStore}>
        <Todo />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add Todo'));

    expect(screen.getByText('Todos (1)')).toBeInTheDocument();
    expect(todoStore.todos).toHaveLength(1);
  });

  it('removes a todo when remove button is clicked', () => {
    // Add a todo first
    const newTodo: TodoModel = {
      id: 1,
      title: 'Test Todo',
      description: 'Test Description',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    };
    todoStore.addTodo(newTodo);

    render(
      <Provider todoStore={todoStore}>
        <Todo />
      </Provider>
    );

    expect(screen.getByText('Todos (1)')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Remove'));

    expect(screen.getByText('Todos (0)')).toBeInTheDocument();
    expect(todoStore.todos).toHaveLength(0);
  });
});