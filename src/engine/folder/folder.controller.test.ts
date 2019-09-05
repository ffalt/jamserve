import {testBaseListController} from '../base/dbobject-list.controller.spec';
import {User} from '../user/user.model';
import {FolderController} from './folder.controller';

describe('FolderController', () => {
	let controller: FolderController;
	let user: User;
	testBaseListController({
		typeName: 'Jam.Folder'
	}, async (jamApi, jamUser) => {
		controller = jamApi.folderController;
		user = jamUser;
		return controller;
	}, () => {
		it('should work', async () => {
			// TODO folderController tests
		});
	});
});
