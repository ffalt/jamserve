import {testService} from '../base/base.service.spec';
import {mockSession} from './session.mock';
import {SessionService} from './session.service';

describe('SessionService', () => {
	let sessionService: SessionService;
	testService({mockData: false},
		async store => {
			sessionService = new SessionService(store.sessionStore);
		},
		() => {
			afterEach(async () => {
				await sessionService.clear();
			});
			describe('.set', () => {
				it('should create a session', async () => {
					const mock = mockSession();
					mock.expires = Date.now() + 60000;
					await sessionService.set(mock);
					const result = await sessionService.get(mock.sessionID);
					expect(result).toBeDefined();
				});
				it('should overwrite a session', async () => {
					const mock = mockSession();
					mock.expires = 1;
					await sessionService.set(mock);
					mock.expires = Date.now() + 60000;
					await sessionService.set(mock);
					expect(await sessionService.count()).toBe(1);
					const result = await sessionService.get(mock.sessionID);
					expect(result).toBeDefined();
					if (result) {
						expect(result.expires).toBe(mock.expires);
					}
				});
			});
			describe('.get', () => {
				it('should not get a expired session', async () => {
					const mock = mockSession();
					mock.expires = Date.now() - 60000;
					await sessionService.set(mock);
					const result = await sessionService.get(mock.sessionID);
					expect(result).toBeUndefined();
				});
			});
			describe('.clear', () => {
				it('should remove all', async () => {
					const mock = mockSession();
					await sessionService.set(mock);
					await sessionService.clear();
					expect(await sessionService.count()).toBe(0);
				});
			});
			describe('.all', () => {
				it('should get all', async () => {
					await sessionService.clear();
					for (let i = 0; i < 5; i++) {
						const mock = mockSession();
						mock.sessionID = `session${i}`;
						await sessionService.set(mock);
					}
					expect(await sessionService.count()).toBe(5);
				});
			});
		}
	);
});
