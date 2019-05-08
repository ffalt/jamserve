import {describe, it} from 'mocha';
import {testBaseListController} from '../base/dbobject-list.controller.spec';
import {User} from '../user/user.model';
import {ArtistController} from './artist.controller';

describe('ArtistController', () => {
	let controller: ArtistController;
	let user: User;
	testBaseListController({
		typeName: 'Jam.Artist'
	}, async (jamApi, jamUser) => {
		controller = jamApi.artistController;
		user = jamUser;
		return controller;
	}, () => {
		it('should work', async () => {
			// TODO artistController tests
		});
	});
});
