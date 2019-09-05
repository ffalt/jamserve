import {testBaseListController} from '../base/dbobject-list.controller.spec';
import {User} from '../user/user.model';
import {EpisodeController} from './episode.controller';

describe('EpisodeController', () => {
	let controller: EpisodeController;
	let user: User;
	testBaseListController({
		typeName: 'Jam.PodcastEpisode'
	}, async (jamApi, jamUser) => {
		controller = jamApi.episodeController;
		user = jamUser;
		return controller;
	}, () => {
		it('should work', async () => {
			// TODO episodeController tests
		});
	});
});
