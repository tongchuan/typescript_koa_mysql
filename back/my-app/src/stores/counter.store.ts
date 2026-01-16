// src/stores/counter.store.ts - 修复的计数器store
import { makeAutoObservable } from 'mobx';

export class CounterStore {
  count = 0;
  
  constructor() {
    makeAutoObservable(this);
  }
  
  increment() {
    this.count++;
  }
  
  decrement() {
    this.count--;
  }
  
  reset() {
    this.count = 0;
  }
  
  get doubleCount() {
    return this.count * 2;
  }
  
  get isPositive() {
    return this.count > 0;
  }
}