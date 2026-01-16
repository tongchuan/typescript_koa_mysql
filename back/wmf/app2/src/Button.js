import {useState} from 'react'
export default ()=>{
	const [count, setCount] = useState(0)
	const myClick = ()=>{
		setCount((count)=>{
			return ++count
		})
	}
	return (<div>
		<p>{count}</p>
		<button onClick={myClick}>app2 button</button>
	</div>)
}