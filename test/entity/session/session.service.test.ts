import { jest } from '@jest/globals';
import { describe, expect, test } from '@jest/globals';
import { Op } from 'sequelize';
import { SessionService } from '../../../src/entity/session/session.service.js';

function makeService(removedCount: number) {
	const service = new SessionService();
	const orm = {
		Session: {
			removeByQueryAndFlush: jest.fn().mockResolvedValue(removedCount as never)
		}
	};
	(service as never as { ormService: unknown }).ormService = { fork: () => orm };
	const notify = { clearCache: jest.fn().mockResolvedValue(undefined as never) };
	service.registerNotify(notify);
	return { service, orm, notify };
}

describe('SessionService.clearExpired', () => {
	test('clears the caches when expired sessions were removed', async () => {
		const { service, notify } = makeService(2);
		await service.clearExpired();
		expect(notify.clearCache).toHaveBeenCalled();
	});

	test('keeps the caches when nothing was removed', async () => {
		const { service, notify } = makeService(0);
		await service.clearExpired();
		expect(notify.clearCache).not.toHaveBeenCalled();
	});
});

describe('SessionService.clearExpiredByUserID', () => {
	test('restricts the removal to the given user', async () => {
		const { service, orm } = makeService(1);
		await service.clearExpiredByUserID('user-1');
		const options = orm.Session.removeByQueryAndFlush.mock.calls[0][0] as { where: { user: string; expires: Record<symbol, unknown> } };
		expect(options.where.user).toBe('user-1');
		expect(options.where.expires[Op.lt]).toBeInstanceOf(Date);
	});

	test('clears the caches when expired sessions were removed', async () => {
		const { service, notify } = makeService(1);
		await service.clearExpiredByUserID('user-1');
		expect(notify.clearCache).toHaveBeenCalled();
	});
});
