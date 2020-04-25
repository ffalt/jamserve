import {testController, validateJamResponse} from '../base/controller.spec';
import {mockUser} from '../user/user.mock';
import {User} from '../user/user.model';
import {SessionController} from './session.controller';

describe('SessionController', () => {
	let controller: SessionController;
	// let api: JamApi;
	let user: User;
	const dummyUser = mockUser();
	testController({}, async (jamApi, jamUser) => {
		dummyUser.id = 'dummyInvalid';
		controller = jamApi.sessionController;
		user = jamUser;
		// api = jamApi;
	}, () => {
		it('should return ping', async () => {
			let result = await controller.ping({query: {}, user: undefined} as any);
			expect(result).toBeDefined();
			await validateJamResponse('Jam.Ping', result);
			result = await controller.ping({query: {}, user});
			expect(result).toBeDefined();
			await validateJamResponse('Jam.Ping', result);
		});
		it('should return session info', async () => {
			let result = await controller.session({query: {}, user: undefined} as any);
			expect(result).toBeDefined();
			await validateJamResponse('Jam.Session', result);
			result = await controller.session({query: {}, user});
			expect(result).toBeDefined();
			expect(result.user).toBeDefined();
			await validateJamResponse('Jam.Session', result);
		});
	});
});
