import {testBaseListController} from '../base/dbobject-list.controller.spec';
import {PodcastController} from './podcast.controller';

describe('PodcastController', () => {
	let controller: PodcastController;
	// let user: User;
	testBaseListController({
		typeName: 'Jam.Podcast'
	}, async (jamApi, jamUser) => {
		controller = jamApi.podcastController;
		// user = jamUser;
		return controller;
	}, () => {
		it('should work', async () => {
			// TODO podcastController tests
		});
	});
});
