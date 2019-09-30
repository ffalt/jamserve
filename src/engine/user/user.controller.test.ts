import {ImageModuleTest} from '../../modules/image/image.module.spec';
import {testBaseController} from '../base/dbobject.controller.spec';
import {UserController} from './user.controller';

describe('UserController', () => {
	let controller: UserController;
	testBaseController({typeName: 'Jam.User'}, async jamApi => {
		controller = jamApi.userController;
		return controller;
	}, () => {
		// it('should work', async () => {});
	}, async () => {
		// TODO: Custom UserController tests
	});
});
