// src/stores/demo.store.ts - 修复的MobX演示store
import { 
  observable, 
  action, 
  computed, 
  reaction, 
  autorun, 
  when, 
  runInAction,
  makeObservable,
  toJS,
  isObservable,
  isObservableArray,
  isObservableObject,
  isObservableMap,
  observe,
  intercept,
  transaction,
  createAtom
} from 'mobx';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
}

// Create a demo store to showcase all MobX APIs
export class DemoStore {
  // 1. observable - 创建可被追踪的状态，可以应用于原始值、对象、数组和映射
  @observable count: number = 0;
  @observable name: string = "MobX 演示";
  @observable todos: Todo[] = [];
  @observable user = { name: "张三", age: 30 };
  @observable items = []; // Add missing items property
  
  // 2. observable.shallow - 只观察对象/数组的第一层，不会深层监听
  @observable.shallow complexData = { deepProp: { value: "嵌套数据" } };
  
  // 3. observable.ref - 只追踪引用变化，不追踪内容变化
  @observable.ref externalObject = { id: 1, data: "外部数据" };
  
  // 4. observable.deep (默认行为) - 深度追踪任何层级的变化
  @observable settings = { theme: "暗色", notifications: { enabled: true } };
  
  // 5. 计算属性 - 从可观测数据自动计算得出
  // 仅在依赖项发生变化时重新计算
  @computed get doubleCount() {
    console.log("正在计算 doubleCount..."); // 仅在需要时运行
    return this.count * 2;
  }
  
  @computed get completedTodosCount() {
    return this.todos.filter(todo => todo.completed).length;
  }
  
  @computed get hasTodos() {
    return this.todos.length > 0;
  }
  
  // 6. Actions - 修改状态的函数
  // 使用 @action 装饰器或 action() 包装器
  @action increment = () => {
    this.count += 1;
  };
  
  @action decrement = () => {
    this.count -= 1;
  };
  
  @action setName = (newName: string) => {
    this.name = newName;
  };
  
  @action addTodo = (title: string) => {
    this.todos.push({
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date()
    });
  };

  @action toggleTodo = (id: number) => {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  };
  
  // 7. runInAction - 在原子操作中运行代码
  // 在处理异步操作时非常有用
  asyncFetchAndSet = async () => {
    const data = await Promise.resolve({ count: 42, name: "异步数据" });
    runInAction(() => {
      this.count = data.count;
      this.name = data.name;
    });
  };
  
  // 8. observe - 监听特定可观测对象的变化
  private observerDisposer: () => void;
  
  setupObserver = () => {
    this.observerDisposer = observe(this, 'count', (change) => {
      console.log('计数观察:', change);
    });
  };
  
  // 9. intercept - 在值改变之前拦截变化
  private interceptorDisposer: () => void;
  
  setupInterceptor = () => {
    this.interceptorDisposer = intercept(this, 'count', (change) => {
      if (change.newValue < 0) {
        console.warn('计数不能为负数，已阻止更改');
        return null; // 阻止更改
      }
      return change; // 允许更改
    });
  };
  
  // 10. transaction - 批量执行操作，只有在事务结束后才会通知观察者
  batchUpdate = () => {
    transaction(() => {
      this.count += 1;
      this.name = "批量更新";
    });
  };
  
  // 11. isObservable - 检查值是否为可观测对象
  checkObservability = (value: any) => {
    return isObservable(value);
  };
  
  // 12. toJS - 将可观测对象转换为纯 JavaScript 对象
  getPureJSObject = () => {
    return toJS(this.todos);
  };
  
  // 16. createAtom - 创建一个自定义的可观察原子单位
  customAtom = createAtom(
    'CustomAtom', // atom name for debugging
    () => console.log('Custom atom observed!'), // onBecomeObserved function
    () => console.log('Custom atom unobserved!') // onBecomeUnobserved function
  );
  
  get atomValue() {
    // Access the atom to trigger onBecomeObserved
    this.customAtom.reportObserved();
    return this.count;
  }

  updateAtomValue(newValue: number) {
    this.count = newValue;
    this.customAtom.reportChanged(); // Notify observers that the value changed
  }
  
  // Method to demonstrate other APIs
  checkObservableTypes = () => {
    console.log('Is observable array:', isObservableArray(this.todos));
    console.log('Is observable object:', isObservableObject(this.user));
    console.log('Is observable map:', isObservableMap(this.observableMap));
  };
  
  // Initialize an observable map for testing
  observableMap = observable.map({ key1: 'value1', key2: 'value2' });
  
  private disposer1: () => void;
  private disposer2: () => void;
  private disposer3: () => void;
  
  constructor() {
    makeObservable(this);
    
    // 13. reaction - 观察特定可观测值并做出反应
    this.disposer1 = reaction(
      () => this.count, // 追踪函数 - 观察什么
      (count, prevCount) => { // 反应函数 - 做什么
        console.log(`计数从 ${prevCount} 变为 ${count}`);
      },
      {
        fireImmediately: false, // 不立即运行
        delay: 100 // 延迟100毫秒执行
      }
    );
    
    // 14. autorun - 自动运行，当任何被观察的值改变时
    this.disposer2 = autorun(() => {
      console.log(`自动运行: 计数是 ${this.count}, 名称是 ${this.name}`);
    });
    
    // 15. when - 等待条件变为真，然后执行一次
    this.disposer3 = when(
      () => this.count >= 5, // 等待的条件
      () => { // 条件满足时执行的动作
        console.log("计数达到5或以上！");
        alert("计数达到5或以上！");
      }
    );
    
    // 设置观察器和拦截器
    this.setupObserver();
    this.setupInterceptor();
  }
  
  // 清理反应以防止内存泄漏的方法
  dispose() {
    if (this.disposer1) this.disposer1();
    if (this.disposer2) this.disposer2();
    if (this.disposer3) this.disposer3();
    if (this.observerDisposer) this.observerDisposer();
    if (this.interceptorDisposer) this.interceptorDisposer();
  }
}