import { DemoStore } from '../../src/stores/demo.store';

describe('DemoStore', () => {
  let store: DemoStore;

  beforeEach(() => {
    store = new DemoStore();
  });

  it('should initialize with default values', () => {
    expect(store.count).toBe(0);
    expect(store.name).toBe('MobX 演示');
    expect(store.todos).toEqual([]);
    expect(store.items).toEqual([]);
  });

  it('should increment count', () => {
    store.increment();
    expect(store.count).toBe(1);
  });

  it('should decrement count', () => {
    store.decrement();
    expect(store.count).toBe(-1);
  });

  it('should set name', () => {
    store.setName('New Name');
    expect(store.name).toBe('New Name');
  });

  it('should calculate double count', () => {
    store.count = 5;
    expect(store.doubleCount).toBe(10);
  });

  it('should add todo', () => {
    store.addTodo('Test Todo');
    expect(store.todos).toHaveLength(1);
    expect(store.todos[0].title).toBe('Test Todo');
  });

  it('should toggle todo completion', () => {
    store.addTodo('Test Todo');
    const todoId = store.todos[0].id;
    store.toggleTodo(todoId);
    expect(store.todos[0].completed).toBe(true);
  });

  it('should calculate completed todos count', () => {
    store.addTodo('Completed Todo');
    store.addTodo('Incomplete Todo');
    const completedTodoId = store.todos[0].id;
    store.toggleTodo(completedTodoId);
    
    expect(store.completedTodosCount).toBe(1);
  });

  it('should handle async fetch and set', async () => {
    await store.asyncFetchAndSet();
    expect(store.count).toBe(42);
    expect(store.name).toBe('异步数据');
  });

  it('should batch update correctly', () => {
    store.batchUpdate();
    expect(store.count).toBe(1);
    expect(store.name).toBe('批量更新');
  });

  it('should check observability', () => {
    expect(store.checkObservability(store.todos)).toBe(true);
  });

  it('should return pure JS object', () => {
    store.addTodo('Test Todo');
    const pureObj = store.getPureJSObject();
    expect(pureObj).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: 'Test Todo' })
    ]));
  });

  it('should check observable types', () => {
    store.checkObservableTypes();
    // Just checking that the method runs without errors
    expect(store.checkObservability(store.todos)).toBe(true);
  });
});