import {describe, it} from 'mocha';
import {testBaseListController} from '../base/dbobject-list.controller.spec';
import {User} from '../user/user.model';
import {AlbumController} from './album.controller';

describe('AlbumController', () => {
	let controller: AlbumController;
	let user: User;
	testBaseListController({
		typeName: 'Jam.Album'
	}, async (jamApi, jamUser) => {
		controller = jamApi.albumController;
		user = jamUser;
		return controller;
	}, () => {
		it('should work', async () => {
			// TODO albumController tests
		});
	});
});
