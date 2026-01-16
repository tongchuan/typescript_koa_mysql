import { CounterStore } from '../../src/stores/counter.store';

describe('CounterStore', () => {
  let store: CounterStore;

  beforeEach(() => {
    store = new CounterStore();
  });

  it('should initialize with default count of 0', () => {
    expect(store.count).toBe(0);
  });

  it('should increment count', () => {
    store.increment();
    expect(store.count).toBe(1);
  });

  it('should decrement count', () => {
    store.decrement();
    expect(store.count).toBe(-1);
  });

  it('should reset count to 0', () => {
    store.increment();
    store.increment();
    expect(store.count).toBe(2);

    store.reset();
    expect(store.count).toBe(0);
  });

  it('should calculate double count', () => {
    store.count = 5;
    expect(store.doubleCount).toBe(10);
  });

  it('should determine if count is positive', () => {
    store.count = 5;
    expect(store.isPositive).toBe(true);

    store.count = -5;
    expect(store.isPositive).toBe(false);

    store.count = 0;
    expect(store.isPositive).toBe(false);
  });
});