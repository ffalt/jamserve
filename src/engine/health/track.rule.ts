import {Track} from '../../objects/track/track.model';
import {RuleResult} from './rule.model';
import {AudioFormatType} from '../../model/jam-types';
import {ID3TrackTagRawFormatTypes} from '../../modules/audio/audio.module';
import {Folder} from '../../objects/folder/folder.model';
import {Root} from '../../objects/root/root.model';
import {Jam} from '../../model/jam-rest-data';
import {flac_test} from '../../modules/audio/tools/flac';
import {MP3Analyzer} from './mp3_analyzer';
import {IID3V2} from 'jamp3/src/lib/id3v2/id3v2__types';
import {ID3v2, IID3V1} from 'jamp3';

interface TagCache {
	id3v2?: IID3V2.Tag;
	id3v1?: IID3V1.Tag;
}

export abstract class TrackRule {

	protected constructor(public id: string, public name: string) {
	}

	abstract run(track: Track, parent: Folder, root: Root, tagCache: TagCache, checkMedia: boolean): Promise<RuleResult | undefined>;
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
	}

}

export class TrackValidMediaRule extends TrackRule {

	constructor() {
		super('track.media.valid', 'Track Media is invalid');
	}

	async run(track: Track, parent: Folder, root: Root, tagCache: TagCache, checkMedia: boolean): Promise<RuleResult | undefined> {
		if (!checkMedia) {
			if (isMP3(track)) {
				const id3v2 = new ID3v2();
				tagCache.id3v2 = await id3v2.read(track.path + track.name);
			}
		} else if (isMP3(track)) {
			const mp3ana = new MP3Analyzer();
			const result = await mp3ana.read(track.path + track.name, {id3v1: false, id3v2: true, mpeg: true, xing: true, ignoreOneOfErrorXingCount: true});
			tagCache.id3v1 = result.tags.id3v1;
			tagCache.id3v2 = result.tags.id3v2;
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
	}

}

const GARBAGE_FRAMES_IDS: Array<string> = [
	'PRIV', // application specific binary, mostly windows media player
	'COMM',
	'POPM'
];

export class TrackID3v2GarbageRule extends TrackRule {

	constructor() {
		super('track.id3v2.garbage.frames', 'Track ID3v2 has garbage frames');
	}

	async run(track: Track, parent: Folder, root: Root, tagCache: TagCache): Promise<RuleResult | undefined> {
		if (tagCache.id3v2) {
			const frames = tagCache.id3v2.frames.filter(frame => GARBAGE_FRAMES_IDS.indexOf(frame.id) >= 0);
			if (frames.length > 0) {
				const ids: Array<string> = [];
				frames.forEach(frame => {
					if (ids.indexOf(frame.id) < 0) {
						ids.push(frame.id);
					}
				});
				return {
					details: ids.map(m => {
						return {reason: m};
					})
				};
			}
		}
	}

}

export class TrackRulesChecker {
	rules: Array<TrackRule> = [];

	constructor() {
		this.rules.push(new TrackID3v2Rule());
		this.rules.push(new TrackTagValuesRule());
		this.rules.push(new TrackValidMediaRule());
		this.rules.push(new TrackID3v2GarbageRule());
	}

	async run(track: Track, parent: Folder, root: Root, checkMedia: boolean): Promise<Array<Jam.HealthHint>> {
		const result: Array<Jam.HealthHint> = [];
		const tagCache = {};
		for (const rule of this.rules) {
			const match = await rule.run(track, parent, root, tagCache, checkMedia);
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
