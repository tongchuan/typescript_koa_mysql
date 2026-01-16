import { UserStore } from '../../src/stores/user.store';
import { User } from '../../src/models/user.model';

describe('UserStore', () => {
  let store: UserStore;

  beforeEach(() => {
    store = new UserStore();
  });

  it('should initialize with empty users array', () => {
    expect(store.users).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should add a user', () => {
    const user: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
    store.addUser(user);
    expect(store.users).toHaveLength(1);
    expect(store.users[0]).toEqual(user);
  });

  it('should remove a user by id', () => {
    const user1: User = { id: 1, name: 'John Doe', email: 'john@example.com' };
    const user2: User = { id: 2, name: 'Jane Smith', email: 'jane@example.com' };
    
    store.addUser(user1);
    store.addUser(user2);
    
    expect(store.users).toHaveLength(2);
    
    store.removeUser(1);
    expect(store.users).toHaveLength(1);
    expect(store.users[0].id).toBe(2);
  });

  it('should fetch users successfully', async () => {
    // Mock fetchUsers implementation would require actual API mocking
    // For now, just test the expected behavior after fetch
    await store.fetchUsers();
    
    expect(store.isLoading).toBe(false);
    expect(store.users).toHaveLength(2); // Based on mock data in store
  });
});