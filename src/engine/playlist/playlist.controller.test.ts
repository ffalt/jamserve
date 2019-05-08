import {describe, it} from 'mocha';
import {testBaseListController} from '../base/dbobject-list.controller.spec';
import {User} from '../user/user.model';
import {PlaylistController} from './playlist.controller';

describe('PlaylistController', () => {
	let controller: PlaylistController;
	let user: User;
	testBaseListController({
		typeName: 'Jam.Playlist'
	}, async (jamApi, jamUser) => {
		controller = jamApi.playlistController;
		user = jamUser;
		return controller;
	}, () => {
		it('should work', async () => {
			// TODO playlistController tests
		});
	});
});
