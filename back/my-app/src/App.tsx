import { useState } from 'react';
import './App.css';
import { StoreProvider } from './contexts/StoreProvider';
import Todo from './components/Todo';
import Test from './components/Test';
import CounterFunction from './components/CounterFunction';

function App() {
  const [count, setCount] = useState(0)

  return (
    <StoreProvider>
      <div className="App">
        <header className="App-header">
          <h1>MobX Demo Application</h1>
          <Test />
          <CounterFunction />
          <Todo />
        </header>
      </div>
    </StoreProvider>
  )
}

export default App
