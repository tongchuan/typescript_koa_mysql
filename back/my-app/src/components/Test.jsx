import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';
import AddItemForm from './Test/AddItemForm';
import ItemList from './Test/ItemList';

const Test = observer(() => {
  const { demoStore } = useStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>MobX API Demonstration</h2>
      
      {/* Basic counter functionality */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Basic Observables & Actions</h3>
        <p>Count: {demoStore.count}</p>
        <p>Double Count (Computed): {demoStore.doubleCount}</p>
        <button onClick={demoStore.increment}>Increment</button>
        <button onClick={demoStore.decrement}>Decrement</button>
        <br />
        <p>Name: {demoStore.name}</p>
        <input 
          type="text" 
          value={demoStore.name} 
          onChange={(e) => demoStore.setName(e.target.value)}
          placeholder="Enter name"
        />
      </div>
      
      {/* Todo list functionality */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Observable Array Example</h3>
        <button onClick={() => demoStore.addTodo(`Todo ${demoStore.todos.length + 1}`)}>
          Add Todo
        </button>
        <p>Total Todos: {demoStore.todos.length}</p>
        <p>Completed Todos: {demoStore.completedTodosCount}</p>
        
        <ul>
          {demoStore.todos.map(todo => (
            <li key={todo.id}>
              <span 
                style={{ 
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#888' : '#000'
                }}
              >
                {todo.title}
              </span>
              <button onClick={() => demoStore.toggleTodo(todo.id)}>
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Advanced features toggle */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>高级特性</h3>
        <button onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? '隐藏' : '显示'} 高级示例
        </button>
        
        {showAdvanced && (
          <div style={{ marginTop: '10px' }}>
            <h4>更多示例：</h4>
            
            {/* Demonstrating different observable types */}
            <div style={{ marginBottom: '10px' }}>
              <p><strong>浅层可观测:</strong> 对 complexData 的更改不会触发更新，除非引用本身改变</p>
              <p>复杂数据值: {demoStore.complexData.deepProp.value}</p>
              <button onClick={() => {
                // 这不会触发反应，因为它是浅层可观测
                demoStore.complexData.deepProp.value = `更新于 ${new Date().toLocaleTimeString()}`;
                console.log("嵌套属性已更改但没有反应触发");
              }}>
                更改嵌套属性（不会触发反应）
              </button>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <p><strong>引用可观测:</strong> 只有引用本身的更改才会触发更新</p>
              <p>外部对象ID: {demoStore.externalObject.id}</p>
              <button onClick={() => {
                // 更改属性不会触发反应
                demoStore.externalObject.data = `更改于 ${new Date().toLocaleTimeString()}`;
                console.log("属性已更改但没有反应触发");
              }}>
                更改外部对象属性（不会触发反应）
              </button>
              <button onClick={() => {
                // 更改引用将触发反应
                demoStore.externalObject = { id: Date.now(), data: `新对象于 ${new Date().toLocaleTimeString()}` };
                console.log("引用已更改 - 应该触发反应");
              }}>
                替换外部对象（将触发反应）
              </button>
            </div>
            
            {/* New API examples */}
            <div style={{ marginBottom: '10px' }}>
              <h5>新增API示例:</h5>
              
              <button onClick={demoStore.batchUpdate}>
                批量更新（Transaction）
              </button>
              
              <button onClick={() => {
                console.log('Todos是否可观测:', demoStore.checkObservability(demoStore.todos));
                console.log('纯JavaScript对象:', demoStore.getPureJSObject());
              }}>
                检查可观测性 & 获取纯JS对象
              </button>
              
              <button onClick={() => {
                if (demoStore.count < 0) {
                  alert('计数不能为负数！');
                } else {
                  demoStore.increment();
                }
              }}>
                尝试递增（带拦截检查）
              </button>
              
              <button onClick={() => {
                demoStore.checkObservableTypes();
              }}>
                检查 Observable 类型 (Array/Object/Map)
              </button>
              
              <button onClick={() => {
                console.log('Custom atom value:', demoStore.atomValue);
              }}>
                使用 Custom Atom
              </button>
              
              <button onClick={() => {
                demoStore.updateAtomValue(demoStore.count + 1);
              }}>
                更新 Custom Atom Value
              </button>
            </div>
            
            {/* Async example */}
            <div style={{ marginBottom: '10px' }}>
              <button onClick={demoStore.asyncFetchAndSet}>
                模拟异步获取
              </button>
            </div>
            
            {/* Manual disposal info */}
            <div>
              <p><em>反应是自动管理的。在实际应用中，您会在组件卸载时手动处置它们。</em></p>
            </div>
          </div>
        )}
      </div>
      
      {/* Show the test form and list */}
      <AddItemForm />
      <ItemList />
    </div>
  );
});

export default Test;