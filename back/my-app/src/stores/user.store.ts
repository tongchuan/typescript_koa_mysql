// src/stores/user.store.ts - Updated to use model classes
import { makeAutoObservable, runInAction } from 'mobx';
import { User as UserModel } from '../models/user.model';

export class UserStore {
  users: UserModel[] = [];
  isLoading = false;
  error: string | null = null;
  
  constructor() {
    makeAutoObservable(this);
  }
  
  async fetchUsers() {
    this.isLoading = true;
    this.error = null;
    
    try {
      // Mock API call - 在实际应用中替换为真实API
      const data = [
        new UserModel(1, 'John Doe', 'john@example.com'),
        new UserModel(2, 'Jane Smith', 'jane@example.com')
      ];
      
      runInAction(() => {
        this.users = data;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch users';
        this.isLoading = false;
      });
    }
  }
  
  addUser(user: UserModel) {
    this.users.push(user);
  }
  
  removeUser(id: number) {
    this.users = this.users.filter(user => user.id !== id);
  }
}