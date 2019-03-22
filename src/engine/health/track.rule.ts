import {Track} from '../../objects/track/track.model';
import {Rule, RuleResult} from './rule.model';
import {AudioFormatType, TrackTagRawFormatTypes} from '../../model/jam-types';

export abstract class TrackRule implements Rule<Track> {

	protected constructor(public id: string, public name: string) {

	}

	abstract run(track: Track): Promise<RuleResult | undefined>;
}

export class TrackID3v2Rule extends TrackRule {

	constructor() {
		super('track.mp3.id3v2.exists', 'ID3v2 Tag is missing');
	}

	async run(track: Track): Promise<RuleResult | undefined> {
		if (track.media && track.media.format === AudioFormatType.mp3 && (TrackTagRawFormatTypes.indexOf(track.tag.format) >= 0)) {
			return {};
		}
		return;
	}

}
