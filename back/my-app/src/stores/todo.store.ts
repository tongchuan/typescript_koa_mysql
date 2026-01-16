// src/stores/todo.store.ts - Updated to use model classes
import { makeAutoObservable, runInAction } from 'mobx';
import { Todo as TodoModel } from '../models/todo.model';

export class TodoStore {
  todos: TodoModel[] = [];
  isLoading = false;
  error: string | null = null;
  
  constructor() {
    makeAutoObservable(this);
  }
  
  async fetchTodos() {
    this.isLoading = true;
    this.error = null;
    
    try {
      // Mock API call - 在实际应用中替换为真实API
      const data = [
        new TodoModel(1, 'Sample Todo', new Date(), new Date(), 1, 'Sample Description')
      ];
      
      runInAction(() => {
        this.todos = data;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch todos';
        this.isLoading = false;
      });
    }
  }
  
  addTodo(todo: TodoModel) {
    this.todos.push(todo);
  }
  
  removeTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}