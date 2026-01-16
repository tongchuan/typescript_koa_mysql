Array.prototype.myFlat = function(depth = 1) {
  if (depth <= 0) return this.slice();
  
  return this.reduce((acc, val) => {
    if (Array.isArray(val)) {
      return acc.concat(val.myFlat(depth - 1));
    }
    return acc.concat(val);
  }, []);
};

// 使用示例
const arr1 = [1, 2, [3, 4, [5, 6]]];
console.log(arr1.myFlat());     // [1, 2, 3, 4, [5, 6]]
console.log(arr1.myFlat(2));    // [1, 2, 3, 4, 5, 6]
console.log(arr1.myFlat(Infinity)); // [1, 2, 3, 4, 5, 6]
console.log(Infinity,Infinity-1)
if(Infinity){
	console.log(Infinity)
}

// const obj = {
  
//   toString() {
//     console.log("toString called");
//     return "200";
//   },
//   // valueOf() {
//   //   console.log("valueOf called");
//   //   return 100;
//   // }
// };

// console.log(obj==1)


// const obj = { name: "Alice", age: 25 };

// // 默认实现：返回对象本身
// console.log(obj.valueOf() === obj); // true
// console.log(obj.valueOf())
// console.log(obj.toString())
// console.log(obj)
// // 自定义 valueOf
// const customObj = {
//   value: 10,
//   valueOf() {
//     return this.value;
//   }
// };

// console.log(customObj + 5); // 15（数值运算）
// console.log(customObj > 9); // true（比较运算）



// // let obj = {
// // 	getter:function(){
// // 		return 1
// // 	}
// // }

// // console.log(obj==1)
// // 
// let obj = {
//   name: 'John'
// };

// console.log(obj.valueOf()); // 输出：{ name: 'John' }，即对象本身
// console.log(obj.toString()); // 输出："[object Object]"

// // 在类型转换中的行为
// let num = Number(obj); // 先调用 valueOf，返回对象本身（非原始值），再调用 toString，得到 "[object Object]"，然后尝试转换为数字，得到 NaN
// console.log(num); // NaN

// let str = String(obj); // 调用 toString，得到 "[object Object]"
// console.log(str); // "[object Object]"


// let myObj = {
//   valueOf: function() {
//     return 123;
//   },
//   toString: function() {
//     return 'Hello';
//   }
// };

// console.log(myObj + 1); // 124，因为 valueOf 返回 123，然后加 1
// console.log(String(myObj)); // "Hello"，调用 toString



// let date = new Date();
// console.log(date.valueOf()); // 时间戳（数字）
// console.log(date.toString()); // 可读的日期字符串

// // 当 Date 对象用于字符串拼接时，调用 toString
// console.log('Today is ' + date); // 调用 toString

// // 当用于数字运算时，调用 valueOf
// console.log(date - 0); // 调用 valueOf，然后相减