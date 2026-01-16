test('相等性匹配器',()=>{
	expect(2+2).toBe(4);
	expect({a:1}).toEqual({a:1});
	expect({a: 1}).not.toEqual({a: 2}); // 不相等
});

// 真值
test('真值匹配器', () => {
	let definedValue=1;
  expect(true).toBeTruthy();
  expect(false).toBeFalsy();
  expect(null).toBeNull();
  expect(undefined).toBeUndefined();
  expect(definedValue).toBeDefined();
});

// 数字
test('数字匹配器', () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);
  
  // 浮点数
  expect(0.1 + 0.2).toBeCloseTo(0.3);
});

// 字符串
test('字符串匹配器', () => {
  expect('team').not.toMatch(/I/);
  expect('Christoph').toMatch(/stop/);
});


// 数组
test('数组匹配器', () => {
  const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'beer',
  ];
  expect(shoppingList).toContain('beer');
  expect(new Set(shoppingList)).toContain('beer');
});

// 异常
test('异常匹配器', () => {
  function compileAndroidCode() {
    throw new Error('you are using the wrong JDK');
  }
  
  expect(compileAndroidCode).toThrow();
  expect(compileAndroidCode).toThrow(Error);
  expect(compileAndroidCode).toThrow('you are using the wrong JDK');
  expect(compileAndroidCode).toThrow(/JDK/);
});




