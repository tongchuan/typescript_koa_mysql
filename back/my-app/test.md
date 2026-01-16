# MobX 深度详解

## 一、MobX 核心哲学与设计理念

### 1. **MobX 的核心原则**
```typescript
// MobX 三大核心原则
1. 应用程序状态是单一事实来源（Single Source of Truth）
2. 派生状态（Derivations）应自动保持最新
3. 响应式系统（Reactions）在状态变化时自动执行
```

### 2. **与 Redux 的对比**

| 维度 | MobX | Redux |
|------|------|-------|
| **编程范式** | 面向对象/响应式编程 | 函数式编程 |
| **状态存储** | 多个可观察的 store | 单一 store |
| **状态更新** | 直接修改（mutation） | 不可变更新（immutable） |
| **异步处理** | 内置支持 | 需要中间件（redux-thunk/saga） |
| **样板代码** | 少 | 多 |
| **学习曲线** | 平缓 | 陡峭 |
| **性能优化** | 自动追踪依赖 | 手动优化（shouldComponentUpdate） |
| **调试** | 相对简单 | 时间旅行调试器 |
| **适用场景** | 中小型应用、快速开发 | 大型应用、需要严格状态管理 |

## 二、MobX 核心概念深度解析

### 1. **Observable（可观察状态）**
```typescript
import { observable, makeObservable, action, computed } from 'mobx';

class TodoStore {
  // 1. 普通 observable - 基础用法
  @observable todos: Todo[] = [];
  
  // 2. observable.ref - 只观察引用变化
  @observable.ref currentFilter: string = 'all';
  
  // 3. observable.shallow - 浅观察（只观察第一层）
  @observable.shallow nestedObject = { a: { b: 1 } };
  
  // 4. observable.struct - 结构对比（深度对比）
  @observable.struct coordinates = { x: 0, y: 0 };
  
  // 5. observable.box - 包装原始值
  count = observable.box(0);
  
  constructor() {
    // 6. makeObservable - 现代用法（推荐）
    makeObservable(this, {
      todos: observable,
      pendingCount: computed,
      addTodo: action,
      toggleTodo: action,
    });
    
    // 7. makeAutoObservable - 自动推断
    // makeAutoObservable(this);
  }
  
  // observable 的不同层级
  @observable.deep deepObject = { 
    level1: {
      level2: {
        level3: 'deep value'
      }
    }
  };
}

// 8. 创建 observable 数据结构
const list = observable([1, 2, 3]);
const map = observable.map({ key: 'value' });
const set = observable.set([1, 2, 3]);
```

### 2. **Action（动作）**
```typescript
import { action, runInAction, flow } from 'mobx';

class UserStore {
  @observable users = [];
  @observable isLoading = false;
  
  // 1. 基本 action
  @action
  addUser(user) {
    this.users.push(user);
  }
  
  // 2. 绑定 action（自动绑定 this）
  @action.bound
  removeUser(id) {
    this.users = this.users.filter(u => u.id !== id);
  }
  
  // 3. 异步 action - runInAction 方式
  @action
  async fetchUsers() {
    this.isLoading = true;
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      // 必须在 runInAction 中修改状态
      runInAction(() => {
        this.users = data;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.isLoading = false;
      });
    }
  }
  
  // 4. 异步 action - flow 方式（Generator）
  fetchUsersFlow = flow(function* (this: UserStore) {
    this.isLoading = true;
    try {
      const response = yield fetch('/api/users');
      const data = yield response.json();
      this.users = data;
      this.isLoading = false;
    } catch (error) {
      this.error = error.message;
      this.isLoading = false;
    }
  }).bind(this);
  
  // 5. action 的严格模式配置
  // configure({ enforceActions: "always" })
}
```

### 3. **Computed（计算属性）**
```typescript
import { computed } from 'mobx';

class TodoStore {
  @observable todos = [];
  
  // 1. 基础 computed
  @computed
  get completedTodos() {
    return this.todos.filter(todo => todo.completed);
  }
  
  // 2. 带参数的计算属性（需要 computedFn）
  @computed.struct
  get todosByStatus() {
    return (status: string) => {
      return this.todos.filter(todo => todo.status === status);
    };
  }
  
  // 3. 缓存机制
  @computed({ keepAlive: true })
  get expensiveCalculation() {
    console.log('Computing...');
    return this.todos.reduce((sum, todo) => sum + todo.value, 0);
  }
  
  // 4. computed 的 equals 配置
  @computed({ equals: (a, b) => a.length === b.length })
  get todosDescription() {
    return this.todos.map(t => t.description);
  }
}
```

### 4. **Reaction（反应）**
```typescript
import { autorun, reaction, when } from 'mobx';

class Store {
  @observable count = 0;
  @observable showNotification = false;
  
  disposers: any[] = [];
  
  setupReactions() {
    // 1. autorun - 自动运行副作用
    const disposer1 = autorun(() => {
      console.log(`Count changed to: ${this.count}`);
      // 这里可以执行副作用，如更新 localStorage
      localStorage.setItem('count', this.count.toString());
    });
    
    // 2. reaction - 更精细的控制
    const disposer2 = reaction(
      // 第一个函数：要观察的数据
      () => this.count,
      // 第二个函数：数据变化时的副作用
      (count, previousCount) => {
        console.log(`Count changed from ${previousCount} to ${count}`);
        if (count > 10) {
          this.showNotification = true;
        }
      },
      // 第三个参数：配置选项
      {
        fireImmediately: true,  // 立即触发一次
        delay: 300,             // 防抖延迟
        equals: (a, b) => Math.abs(a - b) > 5, // 自定义相等判断
      }
    );
    
    // 3. when - 条件满足时执行一次
    const disposer3 = when(
      // 条件函数
      () => this.count > 100,
      // 执行函数
      () => {
        console.log('Count exceeded 100!');
        this.resetCount();
      },
      // 可选：超时时间
      { timeout: 5000 }
    );
    
    this.disposers.push(disposer1, disposer2, disposer3);
  }
  
  cleanup() {
    this.disposers.forEach(disposer => disposer());
  }
}
```

## 三、MobX 响应式系统原理

### 1. **依赖收集机制**
```typescript
// MobX 如何追踪依赖
class DependencyTracker {
  // 1. 创建 observable 时，会创建一个 ObservableValue
  // ObservableValue 包含：
  // - value: 实际值
  // - deps: 依赖此 observable 的 Reaction 集合
  
  // 2. 访问 observable 时（在 reaction 内）
  // - 当前执行的 reaction 会被推入全局栈
  // - observable 的 getter 会将栈顶的 reaction 加入自己的 deps
  
  // 3. 修改 observable 时
  // - 遍历所有依赖此 observable 的 reaction
  // - 将这些 reaction 加入待调度队列
  
  // 4. reaction 执行
  // - 清空旧依赖
  // - 重新收集依赖
  // - 执行副作用
}
```

### 2. **事务（Transaction）**
```typescript
import { transaction, untracked } from 'mobx';

class Store {
  @observable a = 1;
  @observable b = 2;
  
  updateBoth() {
    // 1. transaction - 批量更新
    transaction(() => {
      this.a = 10;
      this.b = 20;
      // 在事务结束前，不会触发 reaction
    });
    // 事务结束后，只触发一次 reaction
    
    // 2. 手动控制通知
    this.a = 30;
    this.b = 40;
    // 这里会触发两次 reaction
  }
  
  untrackedExample() {
    // untracked - 在不建立依赖的情况下读取值
    const sum = untracked(() => this.a + this.b);
    // 不会追踪 this.a 和 this.b 的依赖
  }
}
```

## 四、MobX 6+ 新特性

### 1. **Proxy-based Observables**
```typescript
// MobX 6 使用 Proxy 实现 observable
// 优势：
// 1. 支持动态属性
// 2. 更好的性能
// 3. 更简单的 API

class DynamicStore {
  // 动态添加 observable 属性
  @observable data = {};
  
  addProperty(key: string, value: any) {
    this.data[key] = value; // 自动成为 observable
  }
  
  // 对比：MobX 5 需要 observable.map
  // MobX 6 可以直接使用普通对象
}
```

### 2. **makeAutoObservable**
```typescript
import { makeAutoObservable } from 'mobx';

class AutoStore {
  value = 0;
  list = [];
  
  constructor() {
    // 自动推断：
    // - 所有属性：observable
    // - 所有 getter：computed
    // - 所有方法：action
    // - 所有以 set 开头的方法：action.bound
    makeAutoObservable(this, {}, { autoBind: true });
  }
  
  get doubleValue() {
    return this.value * 2;
  }
  
  increment() {
    this.value++;
  }
  
  // autoBind: true 时会自动绑定
  setValue(newValue: number) {
    this.value = newValue;
  }
  
  // 排除某些字段
  // 私有方法或不想被观察的字段
  private internalMethod() {
    // 不会被观察
  }
}
```

## 五、高级模式与最佳实践

### 1. **Store 设计模式**
```typescript
// 1. 领域驱动设计（DDD）
class DomainStore {
  // 聚合根
  @observable root: RootEntity;
  
  // 值对象
  @observable valueObjects: ValueObject[] = [];
  
  // 领域服务
  @action
  performDomainOperation() {
    // 领域逻辑
  }
}

// 2. CQRS 模式（命令查询职责分离）
class CQRSStore {
  // 命令端（写操作）
  @action
  executeCommand(command: Command) {
    // 修改状态
    this.applyEvent(command.toEvent());
  }
  
  // 查询端（读操作）
  @computed
  get queryResults() {
    return this.projectState();
  }
}

// 3. Event Sourcing
class EventStore {
  @observable events: Event[] = [];
  @observable currentState: State;
  
  @action
  appendEvent(event: Event) {
    this.events.push(event);
    this.applyEvent(event);
  }
  
  private applyEvent(event: Event) {
    // 应用事件到当前状态
  }
}
```

### 2. **性能优化技巧**
```typescript
class OptimizedStore {
  @observable largeData = [];
  
  // 1. 使用 computed 缓存
  @computed
  get filteredData() {
    return this.largeData.filter(item => item.active);
  }
  
  // 2. 避免不必要的观察
  @computed
  get summary() {
    // 使用 untracked 避免建立依赖
    return untracked(() => ({
      total: this.largeData.length,
      // ...
    }));
  }
  
  // 3. 使用 reaction 进行防抖
  setupDebouncedReaction() {
    reaction(
      () => this.largeData,
      () => {
        // 昂贵的操作
        this.updateExternalSystem();
      },
      { delay: 500 } // 防抖 500ms
    );
  }
  
  // 4. 批量更新
  @action
  bulkUpdate(items: any[]) {
    transaction(() => {
      items.forEach(item => {
        this.updateItem(item);
      });
    });
  }
  
  // 5. 使用 observable.struct 避免不必要的更新
  @observable.struct
  config = {
    theme: 'dark',
    language: 'en',
  };
}
```

### 3. **状态持久化**
```typescript
import { autorun } from 'mobx';
import localforage from 'localforage';

class PersistentStore {
  @observable state = {};
  private storageKey = 'app-state';
  
  constructor() {
    this.loadFromStorage();
    this.setupAutoSave();
  }
  
  private async loadFromStorage() {
    const saved = await localforage.getItem(this.storageKey);
    if (saved) {
      runInAction(() => {
        this.state = saved;
      });
    }
  }
  
  private setupAutoSave() {
    // 自动保存到 localStorage
    autorun(
      () => {
        const stateToSave = toJS(this.state);
        localforage.setItem(this.storageKey, stateToSave);
      },
      { delay: 1000 } // 防抖保存
    );
  }
}
```

### 4. **依赖注入与测试**
```typescript
// 1. 依赖注入模式
interface IApiService {
  fetchData(): Promise<any>;
}

class Store {
  constructor(private apiService: IApiService) {
    makeAutoObservable(this);
  }
  
  @observable data = null;
  
  @action
  async loadData() {
    this.data = await this.apiService.fetchData();
  }
}

// 2. 测试友好设计
class TestableStore {
  @observable value = 0;
  
  constructor(public logger?: ILogger) {
    makeAutoObservable(this);
  }
  
  @action
  increment() {
    this.value++;
    this.logger?.log('incremented');
  }
}

// 3. 单元测试示例
describe('TestableStore', () => {
  it('should increment value', () => {
    const mockLogger = { log: jest.fn() };
    const store = new TestableStore(mockLogger);
    
    store.increment();
    
    expect(store.value).toBe(1);
    expect(mockLogger.log).toHaveBeenCalledWith('incremented');
  });
});
```

## 六、MobX 与 React 深度集成

### 1. **自定义 Observer Hooks**
```typescript
import { useObserver, useLocalObservable } from 'mobx-react-lite';

// 1. 自定义 observer hook
export function useObservable<T>(initializer: () => T): T {
  return useLocalObservable(initializer);
}

// 2. 带持久化的 hook
export function usePersistedObservable<T>(
  key: string,
  initializer: () => T
): T {
  const store = useLocalObservable(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initializer();
  });
  
  // 自动保存
  useObserver(() => {
    localStorage.setItem(key, JSON.stringify(toJS(store)));
  });
  
  return store;
}

// 3. 连接外部 store 的 hook
export function useStore<T>(storeClass: new () => T): T {
  const storeRef = useRef<T>();
  
  if (!storeRef.current) {
    storeRef.current = new storeClass();
  }
  
  return storeRef.current!;
}
```

### 2. **性能优化的组件模式**
```typescript
import { observer, Observer } from 'mobx-react-lite';

// 1. Observer 组件 - 细粒度观察
const UserList = observer(({ store }) => (
  <div>
    {store.users.map(user => (
      <Observer key={user.id}>
        {() => (
          <UserItem 
            name={user.name}
            // 只有 user.name 变化时才会重渲染
          />
        )}
      </Observer>
    ))}
  </div>
));

// 2. 拆分组件避免不必要的渲染
const HeavyComponent = observer(({ store }) => {
  // 只观察必要的部分
  const { filteredItems } = store;
  
  return (
    <div>
      <Header />
      {/* 昂贵的列表渲染 */}
      <ItemList items={filteredItems} />
      <Footer />
    </div>
  );
});

// 3. 使用 memo 配合 observer
const MemoizedComponent = observer(
  React.memo(({ store }) => {
    return <div>{store.value}</div>;
  }, 
  // 自定义比较函数
  (prevProps, nextProps) => {
    return prevProps.store.value === nextProps.store.value;
  })
);
```

### 3. **Context 与 Provider 模式**
```typescript
import { createContext, useContext } from 'react';
import { observer } from 'mobx-react-lite';

// 1. 创建多 Store Context
const StoreContext = createContext<{
  userStore: UserStore;
  todoStore: TodoStore;
  uiStore: UIStore;
} | null>(null);

// 2. Provider 组件
export const StoreProvider: React.FC = observer(({ children }) => {
  const [stores] = useState(() => ({
    userStore: new UserStore(),
    todoStore: new TodoStore(),
    uiStore: new UIStore(),
  }));
  
  return (
    <StoreContext.Provider value={stores}>
      {children}
    </StoreContext.Provider>
  );
});

// 3. 自定义 Hook 使用
export function useStores() {
  const stores = useContext(StoreContext);
  if (!stores) {
    throw new Error('useStores must be used within StoreProvider');
  }
  return stores;
}

// 4. 选择性订阅 Hook
export function useStoreSelector<T, R>(
  store: T,
  selector: (store: T) => R
): R {
  return useObserver(() => selector(store));
}
```

## 七、调试与监控

### 1. **MobX DevTools 集成**
```typescript
import { configure } from 'mobx';
import { enableLogging } from 'mobx-logger';

// 1. 配置开发模式
configure({
  enforceActions: 'always', // 开发时强制使用 action
  computedRequiresReaction: true, // 计算值必须在 reaction 内访问
  reactionRequiresObservable: true, // reaction 必须观察 observable
  observableRequiresReaction: false, // 允许在 action 外创建 observable
  disableErrorBoundaries: false, // 不捕获错误
});

// 2. 启用日志
enableLogging({
  predicate: () => process.env.NODE_ENV === 'development',
  action: true,
  reaction: true,
  transaction: true,
  compute: true,
});

// 3. 使用 mobx-react-devtools
import { MobXProviderContext } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

const App = () => (
  <>
    <DevTools />
    {/* 应用内容 */}
  </>
);
```

### 2. **自定义监控工具**
```typescript
class MobXMonitor {
  private reactions = new Map();
  private actions = new Map();
  
  trackReaction(name: string, reaction: any) {
    this.reactions.set(name, {
      reaction,
      dependencies: new Set(),
      runCount: 0,
      lastRun: null,
    });
  }
  
  trackAction(name: string, action: Function) {
    this.actions.set(name, {
      action,
      callCount: 0,
      lastCall: null,
    });
    
    // 包装 action 进行监控
    return (...args: any[]) => {
      const startTime = performance.now();
      const result = action(...args);
      const endTime = performance.now();
      
      const info = this.actions.get(name);
      info.callCount++;
      info.lastCall = new Date();
      info.lastDuration = endTime - startTime;
      
      return result;
    };
  }
  
  getMetrics() {
    return {
      reactions: Array.from(this.reactions.values()),
      actions: Array.from(this.actions.values()),
    };
  }
}
```

## 八、常见问题与解决方案

### 1. **循环依赖问题**
```typescript
// 问题：Store A 依赖 Store B，Store B 依赖 Store A
// 解决方案：使用依赖注入或延迟初始化

class StoreA {
  @observable value = 0;
  storeB?: StoreB;
  
  setStoreB(b: StoreB) {
    this.storeB = b;
  }
}

class StoreB {
  @observable value = 0;
  storeA?: StoreA;
  
  setStoreA(a: StoreA) {
    this.storeA = a;
  }
}

// 创建后连接
const storeA = new StoreA();
const storeB = new StoreB();
storeA.setStoreB(storeB);
storeB.setStoreA(storeA);
```

### 2. **内存泄漏**
```typescript
class LeakFreeStore {
  private disposers: Array<() => void> = [];
  
  constructor() {
    // 收集所有 disposer
    this.disposers.push(
      autorun(() => {
        // 副作用
      }),
      reaction(
        () => this.someValue,
        () => {
          // 副作用
        }
      )
    );
  }
  
  dispose() {
    // 清理所有 reaction
    this.disposers.forEach(disposer => disposer());
    this.disposers = [];
  }
}

// 在 React 组件中使用
useEffect(() => {
  const store = new LeakFreeStore();
  
  return () => {
    store.dispose();
  };
}, []);
```

### 3. **数组操作陷阱**
```typescript
class ArrayStore {
  @observable items = [];
  
  // ❌ 错误的数组操作
  addItem(item) {
    this.items[this.items.length] = item; // 不会触发更新
    this.items.concat([item]); // 不会触发更新
  }
  
  // ✅ 正确的数组操作
  @action
  addItemCorrect(item) {
    this.items.push(item); // 触发更新
    this.items = [...this.items, item]; // 触发更新
  }
  
  @action
  updateItem(index, newItem) {
    this.items[index] = newItem; // 触发更新
    this.items = this.items.map((item, i) => 
      i === index ? newItem : item
    ); // 触发更新
  }
}
```

## 九、MobX 生态系统

### 1. **常用库与工具**
```bash
# 核心
mobx                 # 核心库
mobx-react-lite      # React 函数组件集成
mobx-react           # React 类组件集成

# 工具
mobx-utils           # 实用工具函数
mobx-state-tree      # 有 opinion 的状态管理
mobx-persist         # 状态持久化
mobx-remotedev       # Redux DevTools 集成
mobx-logger          # 日志记录

# 框架集成
mobx-vue             # Vue 集成
mobx-angular         # Angular 集成
```

### 2. **mobx-utils 实用工具**
```typescript
import {
  fromPromise,      // 包装 Promise 为 observable
  fromResource,     // 创建资源 observable
  lazyObservable,   // 惰性 observable
  queueProcessor,   // 队列处理器
  now,              // 自动更新的时间 observable
  createViewModel,  // 创建编辑模型
} from 'mobx-utils';

class UtilsStore {
  // 1. fromPromise - 处理异步状态
  userPromise = fromPromise(
    fetch('/api/user').then(r => r.json())
  );
  
  // 2. createViewModel - 编辑模式
  @observable user = { name: 'John', age: 30 };
  
  get editModel() {
    return createViewModel(this.user);
  }
  
  saveChanges() {
    if (this.editModel.isDirty) {
      this.editModel.submit();
    }
  }
  
  cancelChanges() {
    this.editModel.reset();
  }
}
```

## 十、总结与最佳实践

### 1. **MobX 适用场景**
- ✅ 中小型应用快速开发
- ✅ 需要灵活状态管理的项目
- ✅ 团队熟悉面向对象编程
- ✅ 需要最小化样板代码
- ✅ 原型开发或创业项目

### 2. **最佳实践清单**
```typescript
// 1. 始终使用 makeAutoObservable 或 makeObservable
// 2. 将业务逻辑放在 Store 中，组件只负责渲染
// 3. 使用 @action 标记所有状态修改方法
// 4. 使用 @computed 缓存派生状态
// 5. 使用 runInAction 包装异步更新
// 6. 及时清理 reaction（useEffect 返回清理函数）
// 7. 避免在组件中直接修改 store 状态
// 8. 使用 Provider 模式管理 store 依赖
// 9. 开发环境启用 enforceActions: 'always'
// 10. 使用 TypeScript 获得类型安全
```

### 3. **架构建议**
```
src/
├── stores/           # MobX stores
│   ├── domain/      # 领域 store
│   ├── ui/          # UI store
│   └── index.ts     # store 聚合
├── models/          # 数据模型
├── services/        # API 服务
├── utils/           # 工具函数
└── components/      # React 组件
```

MobX 的核心优势在于它的简单性和直观性。通过响应式编程，开发者可以专注于业务逻辑，而不需要关心状态更新的细节。对于大多数应用来说，MobX 提供了比 Redux 更优雅和高效的解决方案。