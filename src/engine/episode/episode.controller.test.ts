import {testBaseListController} from '../base/dbobject-list.controller.spec';
import {EpisodeController} from './episode.controller';

describe('EpisodeController', () => {
	let controller: EpisodeController;
	testBaseListController({
		typeName: 'Jam.PodcastEpisode'
	}, async (jamApi, jamUser) => {
		controller = jamApi.episodeController;
		return controller;
	}, () => {
		it('should work', async () => {
			// TODO episodeController tests
		});
	});
});
