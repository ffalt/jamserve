import { describe, expect, test } from '@jest/globals';
import { DebouncePromises } from '../../utils/debounce-promises.js';

describe('DebouncePromises', () => {
	describe('isPending', () => {
		test('should return false for non-pending ID', () => {
			const debouncer = new DebouncePromises<string>();
			expect(debouncer.isPending('test')).toBe(false);
		});

		test('should return true for pending ID', () => {
			const debouncer = new DebouncePromises<string>();
			debouncer.setPending('test');
			expect(debouncer.isPending('test')).toBe(true);
		});
	});

	describe('setPending', () => {
		test('should set an ID as pending', () => {
			const debouncer = new DebouncePromises<string>();
			debouncer.setPending('test');
			expect(debouncer.isPending('test')).toBe(true);
		});
	});

	describe('append', () => {
		test('should return a promise that resolves when resolved', async () => {
			const debouncer = new DebouncePromises<string>();
			const promise = debouncer.append('test');
			debouncer.resolve('test', 'result');
			const result = await promise;
			expect(result).toBe('result');
		});

		test('should return a promise that rejects when rejected', async () => {
			const debouncer = new DebouncePromises<string>();
			const promise = debouncer.append('test');
			const error = new Error('Test error');
			debouncer.reject('test', error);
			await expect(promise).rejects.toThrow('Test error');
		});

		test('should handle multiple appends for the same ID', async () => {
			const debouncer = new DebouncePromises<string>();
			const promise1 = debouncer.append('test');
			const promise2 = debouncer.append('test');
			debouncer.resolve('test', 'result');
			const [result1, result2] = await Promise.all([promise1, promise2]);
			expect(result1).toBe('result');
			expect(result2).toBe('result');
		});
	});

	describe('resolve', () => {
		test('should resolve all pending promises for an ID', async () => {
			const debouncer = new DebouncePromises<string>();
			const promise1 = debouncer.append('test');
			const promise2 = debouncer.append('test');
			debouncer.resolve('test', 'result');
			const [result1, result2] = await Promise.all([promise1, promise2]);
			expect(result1).toBe('result');
			expect(result2).toBe('result');
		});

		test('should remove the ID from pending after resolving', () => {
			const debouncer = new DebouncePromises<string>();
			debouncer.setPending('test');
			debouncer.resolve('test', 'result');
			expect(debouncer.isPending('test')).toBe(false);
		});

		test('should not affect other pending IDs', async () => {
			const debouncer = new DebouncePromises<string>();
			const promise1 = debouncer.append('test1');
			const promise2 = debouncer.append('test2');
			debouncer.resolve('test1', 'result1');
			expect(debouncer.isPending('test2')).toBe(true);
			const result1 = await promise1;
			expect(result1).toBe('result1');
			debouncer.resolve('test2', 'result2');
			const result2 = await promise2;
			expect(result2).toBe('result2');
		});
	});

	describe('reject', () => {
		test('should reject all pending promises for an ID', async () => {
			const debouncer = new DebouncePromises<string>();
			const promise1 = debouncer.append('test');
			const promise2 = debouncer.append('test');
			const error = new Error('Test error');
			debouncer.reject('test', error);
			await expect(promise1).rejects.toThrow('Test error');
			await expect(promise2).rejects.toThrow('Test error');
		});

		test('should remove the ID from pending after rejecting', () => {
			const debouncer = new DebouncePromises<string>();
			debouncer.setPending('test');
			debouncer.reject('test', new Error('Test error'));
			expect(debouncer.isPending('test')).toBe(false);
		});

		test('should not affect other pending IDs', async () => {
			const debouncer = new DebouncePromises<string>();
			const promise1 = debouncer.append('test1');
			const promise2 = debouncer.append('test2');
			debouncer.reject('test1', new Error('Test error'));
			expect(debouncer.isPending('test2')).toBe(true);
			await expect(promise1).rejects.toThrow('Test error');
			debouncer.resolve('test2', 'result2');
			const result2 = await promise2;
			expect(result2).toBe('result2');
		});
	});

	describe('edge cases', () => {
		test('should handle resolving non-existent ID', () => {
			const debouncer = new DebouncePromises<string>();
			expect(() => debouncer.resolve('nonexistent', 'result')).not.toThrow();
		});

		test('should handle rejecting non-existent ID', () => {
			const debouncer = new DebouncePromises<string>();
			expect(() => debouncer.reject('nonexistent', new Error('Test error'))).not.toThrow();
		});
	});
});
