import React,{Suspense,Profiler} from 'react'
import logo from './logo.svg';
import './App.css';
const RemoteButton = React.lazy(() => import('app2/Button'));
const RemoteTest = React.lazy(()=>import('app2/Test'))
function onRenderCallback(
  id, // 发生提交的 Profiler 树的 "id"
  phase, // "mount"（如果组件树刚加载） 或者 "update"（如果它重渲染了）之一
  actualDuration, // 本次更新 committed 花费的渲染时间
  baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
  startTime, // 本次更新中 React 开始渲染的时间
  commitTime, // 本次更新中 React committed 的时间
  interactions // 属于本次更新的 interactions 的集合
) {
  // 汇总或记录渲染时间
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  });
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
    <div className="App">
      <Suspense fallback="Loading Button...">
        <RemoteButton />
        <RemoteTest />
      </Suspense>
     {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>*/}
    </div>
    </Profiler>
  );
}

export default App;
