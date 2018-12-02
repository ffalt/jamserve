import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {JamRequest} from '../../api/jam/api';
import {TrackController} from '../track/track.controller';
import {formatPlayQueue} from './playqueue.format';
import {PlayQueueService} from './playqueue.service';

export class PlayQueueController {

	constructor(
		private playqueueService: PlayQueueService,
		private trackController: TrackController
	) {
	}

	async get(req: JamRequest<JamParameters.PlayQueue>): Promise<Jam.PlayQueue> {
		const playQueue = await this.playqueueService.getQueueOrCreate(req.user.id, req.client);
		const result = formatPlayQueue(playQueue, req.query);
		if (req.query.playQueueTracks) {
			result.tracks = await this.trackController.prepareListByIDs(playQueue.trackIDs, req.query, req.user);
		}
		return result;
	}

	async update(req: JamRequest<JamParameters.PlayQueueSet>): Promise<void> {
		await this.playqueueService.saveQueue(req.user.id, req.query.trackIDs, req.query.currentID, req.query.position, req.client);
	}

	async delete(req: JamRequest<{}>): Promise<void> {
		await this.playqueueService.removeQueue(req.user.id);
	}


}
