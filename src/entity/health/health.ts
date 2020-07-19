import {TrackHealthHint} from './health.model';
import {Track} from '../track/track';

export class TrackHealth {
	track!: Track;
	health!: Array<TrackHealthHint>;
}
