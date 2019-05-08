import {describe, it} from 'mocha';
import {testBaseListController} from '../base/dbobject-list.controller.spec';
import {User} from '../user/user.model';
import {TrackController} from './track.controller';

describe('TrackController', () => {
	let controller: TrackController;
	let user: User;
	testBaseListController({
		typeName: 'Jam.Track'
	}, async (jamApi, jamUser) => {
		controller = jamApi.trackController;
		user = jamUser;
		return controller;
	}, () => {
		it('should work', async () => {
			// TODO trackController tests
		});
	});
});
