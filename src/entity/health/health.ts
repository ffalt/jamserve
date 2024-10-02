import { TrackHealthHint } from './health.model.js';
import { Track } from '../track/track.js';

export class TrackHealth {
	track!: Track;
	health!: Array<TrackHealthHint>;
}
