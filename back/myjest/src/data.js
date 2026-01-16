
function fetchData(data){
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			resolve(data)
		},1000)
	})
}
function fetchData2(data){
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			reject(data)
		},1000)
	})
}

function fetchData3(callback,error,data){
	setTimeout(()=>{
			callback(error,data)
		},1000)
}
module.exports = {
	fetchData,
	fetchData2,
	fetchData3
}