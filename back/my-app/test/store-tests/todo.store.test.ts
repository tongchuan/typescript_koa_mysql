import { TodoStore } from '../../src/stores/todo.store';
import { Todo as TodoModel } from '../../src/models/todo.model';

describe('TodoStore', () => {
  let store: TodoStore;

  beforeEach(() => {
    store = new TodoStore();
  });

  it('should initialize with empty todos array', () => {
    expect(store.todos).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should add a todo', () => {
    const todo: TodoModel = new TodoModel(1, 'Test Todo', new Date(), new Date(), 1, 'Test Description');
    store.addTodo(todo);
    expect(store.todos).toHaveLength(1);
    expect(store.todos[0]).toEqual(todo);
  });

  it('should remove a todo by id', () => {
    const todo1: TodoModel = new TodoModel(1, 'Test Todo 1', new Date(), new Date(), 1, 'Test Description 1');
    const todo2: TodoModel = new TodoModel(2, 'Test Todo 2', new Date(), new Date(), 1, 'Test Description 2');
    
    store.addTodo(todo1);
    store.addTodo(todo2);
    
    expect(store.todos).toHaveLength(2);
    
    store.removeTodo(1);
    expect(store.todos).toHaveLength(1);
    expect(store.todos[0].id).toBe(2);
  });

  it('should fetch todos successfully', async () => {
    await store.fetchTodos();
    
    expect(store.isLoading).toBe(false);
    expect(store.todos).toHaveLength(1); // Based on mock data in store
  });
});