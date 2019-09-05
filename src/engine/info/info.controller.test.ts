import {JamApi, JamRequest} from '../../api/jam/api';
import {testController, validateJamResponse} from '../base/controller.spec';
import {mockUserName} from '../user/user.mock';
import {User} from '../user/user.model';

describe('InfoController', () => {
	let jam: JamApi;
	let user: User;
	testController({}, async (jamApi) => {
		jam = jamApi;
		user = await jamApi.engine.userService.getByName(mockUserName) as User;
		if (!user) {
			return Promise.reject(Error('Invalid Test Setup'));
		}
	}, () => {
		it('should return ping', async () => {
			let result = await jam.infoController.ping({query: {}} as JamRequest<{}>);
			expect(result).toBeTruthy();
			await validateJamResponse('Jam.Ping', result);
			result = await jam.infoController.ping({query: {}, user});
			expect(result).toBeTruthy();
			await validateJamResponse('Jam.Ping', result);
		});
		it('should return session info', async () => {
			let result = await jam.infoController.session({query: {}} as JamRequest<{}>);
			expect(result).toBeTruthy();
			await validateJamResponse('Jam.Session', result);
			result = await jam.infoController.session({query: {}, user});
			expect(result).toBeTruthy();
			expect(result.user).toBeTruthy();
			await validateJamResponse('Jam.Session', result);
		});
	}, async () => {

	});
});
