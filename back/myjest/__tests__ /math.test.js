const {sum,multiply} = require('../src/math')
describe('Math 模块',()=>{
	describe('sum 函数',()=>{
		test('sum 函数',()=>{
			expect(sum(1,2)).toBe(3)
		})
		test('sum 函数',()=>{
			expect(sum(0.1,0.2)).toBeCloseTo(0.3)
			// expect(sum(0.1,0.2)).toBe(0.3)
		});
	});
	

	describe('multiply 函数',()=>{
		it('两数相乘',()=>{
			expect(multiply(4,5)).toBe(20)
		});
	});
});