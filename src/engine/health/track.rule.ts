import {Track} from '../../objects/track/track.model';
import {RuleResult} from './rule.model';
import {AudioFormatType} from '../../model/jam-types';
import {ID3TrackTagRawFormatTypes} from '../../modules/audio/audio.module';
import {Folder} from '../../objects/folder/folder.model';
import {Root} from '../../objects/root/root.model';
import {Jam} from '../../model/jam-rest-data';
import {MP3, MP3Analyzer} from 'jamp3';
import {flac_test} from '../../modules/audio/tools/flac';

export abstract class TrackRule {

	protected constructor(public id: string, public name: string) {

	}

	abstract run(track: Track, parent: Folder, root: Root): Promise<RuleResult | undefined>;
}


function hasID3v2Tag(track: Track): boolean {
	return ID3TrackTagRawFormatTypes.indexOf(track.tag.format) >= 0;
}


function isMP3(track: Track): boolean {
	return track.media && track.media.format === AudioFormatType.mp3;
}

function isFlac(track: Track): boolean {
	return track.media && track.media.format === AudioFormatType.flac;
}

export class TrackID3v2Rule extends TrackRule {

	constructor() {
		super('track.mp3.id3v2.exists', 'ID3v2 Tag is missing');
	}

	async run(track: Track): Promise<RuleResult | undefined> {
		if (isMP3(track) && !hasID3v2Tag(track)) {
			return {};
		}
		return;
	}

}

export class TrackTagValuesRule extends TrackRule {

	constructor() {
		super('track.tag.values.exists', 'Tag Values missing');
	}

	async run(track: Track): Promise<RuleResult | undefined> {
		const missing = [];
		if (!track.tag.album) {
			missing.push('album');
		}
		if (!track.tag.artist) {
			missing.push('artist');
		}
		if (!track.tag.albumArtist) {
			missing.push('album artist');
		}
		if (!track.tag.year) {
			missing.push('year');
		}
		if (!track.tag.genre) {
			missing.push('genre');
		}
		if (!track.tag.track) {
			missing.push('track nr');
		}
		if (!track.tag.trackTotal) {
			missing.push('total track count');
		}
		if (missing.length > 0) {
			return {
				details: missing.map(m => {
					return {reason: 'value empty', expected: m};
				})
			};
		}
		return;
	}

}

export class TrackValidMediaRule extends TrackRule {

	constructor() {
		super('track.media.valid', 'Track Media is invalid');
	}

	async run(track: Track): Promise<RuleResult | undefined> {
		if (isMP3(track)) {
			const mp3ana = new MP3Analyzer();
			const result = await mp3ana.read(track.path + track.name, {id3v1: false, id3v2: true, mpeg: true, xing: true});
			if (result.msgs && result.msgs.length > 0) {
				return {
					details: result.msgs.map(m => {
						return {reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString()};
					})
				};
			}
		} else if (isFlac(track)) {
			const errMsg = await flac_test(track.path + track.name);
			if (errMsg) {
				return {details: [{reason: errMsg}]};
			}
		}
		return;
	}

}

export class TrackRulesChecker {
	rules: Array<TrackRule> = [];

	constructor() {
		this.rules.push(new TrackID3v2Rule());
		this.rules.push(new TrackTagValuesRule());
		this.rules.push(new TrackValidMediaRule());
	}

	async run(track: Track, parent: Folder, root: Root): Promise<Array<Jam.HealthHint>> {
		const result: Array<Jam.HealthHint> = [];
		for (const rule of this.rules) {
			const match = await rule.run(track, parent, root);
			if (match) {
				result.push({
					id: rule.id,
					name: rule.name,
					details: match.details
				});
			}
		}
		return result;
	}

}
