import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';

const CounterFunction: React.FC = observer(() => {
  const { counterStore } = useStore();
  
  return (
    <div className="counter">
      <h2>Function Component</h2>
      <p>Count: {counterStore.count}</p>
      <div className="buttons">
        <button onClick={() => counterStore.increment()}>+</button>
        <button onClick={() => counterStore.decrement()}>-</button>
      </div>
    </div>
  );
});

export default CounterFunction;