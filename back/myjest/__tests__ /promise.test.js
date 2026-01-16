const {fetchData,fetchData2,fetchData3} = require('../src/data')

// 返回 Promise
test('Promise 测试', () => {
  return fetchData('peanut butter').then(data => {
    expect(data).toBe('peanut butter');
  });
});

// 使用 .resolves/.rejects
test('resolves 测试', () => {
  return expect(fetchData('peanut butter')).resolves.toBe('peanut butter');
});

test('rejects 测试', () => {
  return expect(fetchData2('peanut butter error')).rejects.toMatch('error');
});


test('async/await 测试', async () => {
  const data = await fetchData('peanut butter');
  expect(data).toBe('peanut butter');
});

test('async/await with resolves', async () => {
  await expect(fetchData('peanut butter')).resolves.toBe('peanut butter');
});


test('回调函数测试', done => {
  function callback(error, data) {
    if (error) {
      done(error);
      return;
    }
    try {
      expect(data).toBe('peanut butter');
      done();
    } catch (error) {
      done(error);
    }
  }
  
  fetchData3(callback,null,'peanut butter');
});