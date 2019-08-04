import {describe} from 'mocha';
import {testBaseController} from '../base/dbobject.controller.spec';
import {UserController} from './user.controller';

describe('UserController', () => {
	let controller: UserController;
	testBaseController({typeName: 'Jam.User'}, async (jamApi) => {
		controller = jamApi.userController;
		return controller;
	}, () => {
		// it('should work', async () => {});
	}, async () => {

	});
});
