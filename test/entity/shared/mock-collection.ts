import { jest } from '@jest/globals';

export interface MockCollection<T> {
	getItems: ReturnType<typeof jest.fn>;
	count: ReturnType<typeof jest.fn>;
	items?: Array<T>;
}

export function makeMockCollection<T>(items: Array<T>): MockCollection<T> {
	return {
		getItems: jest.fn().mockResolvedValue(items as never),
		count: jest.fn().mockResolvedValue(items.length as never)
	};
}
