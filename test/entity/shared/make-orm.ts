import { jest } from '@jest/globals';
import type { Orm } from '../../../src/modules/engine/services/orm.service.js';
import { mockStateEmpty } from './mock-data.js';

export function makeMockOrm(state = mockStateEmpty) {
	return {
		State: {
			findOrCreate: jest.fn().mockResolvedValue(state as never)
		}
	} as unknown as Orm;
}

export function makeFolderOrm(folder?: unknown) {
	return {
		Folder: {
			findOneFilter: jest.fn().mockResolvedValue(folder as never)
		}
	};
}
