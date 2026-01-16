// 创建 Mock 函数
const mockCallback = jest.fn(x => 42 + x);

test('forEach mock function', () => {
  const array = [0, 1];
  // forEach(array, mockCallback);
  array.forEach(mockCallback)
  // Mock 函数被调用了两次
  expect(mockCallback.mock.calls.length).toBe(2);
  
  // 第一次调用的第一个参数是 0
  expect(mockCallback.mock.calls[0][0]).toBe(0);
  
  // 第二次调用的第一个参数是 1
  expect(mockCallback.mock.calls[1][0]).toBe(1);
  
  // 第一次调用的返回值是 42
  expect(mockCallback.mock.results[0].value).toBe(42);
});

// Mock 属性
test('mock 属性', () => {
  const myMock = jest.fn();
  
  // mock 实例
  const a = new myMock();
  const b = {};
  const bound = myMock.bind(b);
  bound();
  
  // console.log(myMock.mock.instances); // [ mockConstructor {}, {} ]
  
  // mock 调用信息
  myMock('arg1', 'arg2');
  myMock('arg3', 'arg4');
  
  // console.log(myMock.mock.calls); // [ ['arg1', 'arg2'], ['arg3', 'arg4'] ]
});



const myMock = jest.fn();

// 链式调用
myMock
  .mockReturnValueOnce(10)
  .mockReturnValueOnce('x')
  .mockReturnValue(true);

// console.log(myMock(), myMock(), myMock(), myMock()); // 10, 'x', true, true

test('对象快照', () => {
  const user = {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James',
  };
  
  expect(user).toMatchSnapshot({});
});