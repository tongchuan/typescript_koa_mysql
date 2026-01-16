import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';
import { Todo as TodoModel } from '../models/todo.model';

const Todo = observer(() => {
  const { todoStore } = useStore();

  return (
    <div className="todo">
      <div>
        <button onClick={() => todoStore.addTodo(new TodoModel(
          Date.now(), 
          `Todo ${todoStore.todos.length + 1}`, 
          'Sample description',
          new Date(),
          new Date(),
          1
        ))}>
          Add Todo
        </button>
      </div>
      <div>
        <h3>Todos ({todoStore.todos.length})</h3>
        <ul>
          {todoStore.todos.map((todo) => (
            <li key={todo.id}>
              <span
                style={{
                  textDecoration: todo.id % 2 === 0 ? 'line-through' : 'none',
                }}
              >
                {todo.title}
              </span>
              <button onClick={() => todoStore.removeTodo(todo.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default Todo;