expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    // console.log(received, floor, ceiling)
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

test('自定义匹配器', () => {
  expect(100).toBeWithinRange(90, 110);
  expect(102).not.toBeWithinRange(0, 100);
});