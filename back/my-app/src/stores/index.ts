// src/stores/index.ts - 重新组织的统一入口
import { createContext, useContext } from 'react';
import { CounterStore } from './counter.store';
import { UserStore } from './user.store';
import { TodoStore } from './todo.store';
import { DemoStore } from './demo.store';

// 导入所有store类
export { CounterStore } from './counter.store';
export { UserStore } from './user.store';
export { TodoStore } from './todo.store';
export { DemoStore } from './demo.store';

// 创建根store类，整合所有子store
class RootStore {
  counterStore: import('./counter.store').CounterStore;
  userStore: import('./user.store').UserStore;
  todoStore: import('./todo.store').TodoStore;
  demoStore: import('./demo.store').DemoStore;
  
  constructor() {
    this.counterStore = new CounterStore();
    this.userStore = new UserStore();
    this.todoStore = new TodoStore();
    this.demoStore = new DemoStore();
  }
}

// 创建全局实例
export const rootStore = new RootStore();

// React Context
export const StoreContext = createContext<RootStore>(rootStore);
export const useStore = () => useContext(StoreContext);