import { makeAutoObservable, observable, action } from 'mobx';

export interface TestItem {
  id: number;
  name: string;
  description: string;
}

class TestStore {
  items = observable<TestItem>([]);

  constructor() {
    makeAutoObservable(this);
    // Add some sample data
    this.items.push(
      { id: 1, name: 'Item 1', description: 'Description for item 1' },
      { id: 2, name: 'Item 2', description: 'Description for item 2' }
    );
  }

  @action
  addItem = (name: string, description: string) => {
    const newItem: TestItem = {
      id: Date.now(), // Simple ID generation
      name,
      description
    };
    this.items.push(newItem);
  };

  @action
  deleteItem = (id: number) => {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  };

  @action
  updateItem = (id: number, name: string, description: string) => {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.name = name;
      item.description = description;
    }
  };
}

export default TestStore;