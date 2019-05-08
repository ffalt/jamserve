/* tslint:disable:max-classes-per-file */
import {ID3v2, IID3V1, MP3Analyzer} from 'jamp3';
import {IMP3Warning} from 'jamp3/dist/lib/mp3/mp3_analyzer';
import {IID3V2} from 'jamp3/src/lib/id3v2/id3v2__types';
import {Jam} from '../../model/jam-rest-data';
import {AlbumTypesArtistMusic, AudioFormatType} from '../../model/jam-types';
import {ID3TrackTagRawFormatTypes} from '../../modules/audio/audio.module';
import {flac_test} from '../../modules/audio/tools/flac';
import Logger from '../../utils/logger';
import {Folder} from '../folder/folder.model';
import {Root} from '../root/root.model';
import {Track} from '../track/track.model';
import {RuleResult} from './rule.model';

const log = Logger('TrackHealth');

interface MediaCache {
	id3v2?: IID3V2.Tag;
	id3v1?: IID3V1.Tag;
	id3v2Warnings?: Array<IMP3Warning>;
	mp3Warnings?: Array<IMP3Warning>;
	flacWarnings?: string;
}

export abstract class TrackRule {

	protected constructor(public id: string, public name: string) {
	}

	abstract run(track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined>;
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

	async run(track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined> {
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
		if (!track.tag.genre) {
			missing.push('genre');
		}
		if (!track.tag.track) {
			missing.push('track nr');
		}
		if (!track.tag.trackTotal) {
			missing.push('total track count');
		}
		if (parent.tag.albumType !== undefined && AlbumTypesArtistMusic.indexOf(parent.tag.albumType) >= 0) {
			if (!track.tag.year) {
				missing.push('year');
			}
		}
		if (missing.length > 0) {
			return {
				details: missing.map(m => {
					return {reason: m};
				})
			};
		}
	}

}

export class TrackValidMediaRule extends TrackRule {

	constructor() {
		super('track.media.valid', 'Track Media is invalid');
	}

	async run(track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined> {
		if (isMP3(track) && tagCache.mp3Warnings && tagCache.mp3Warnings.length > 0) {
			const mp3Warnings = tagCache.mp3Warnings.filter(m => {
				return m.msg !== 'XING: VBR detected, but no VBR head frame found';
			});
			if (mp3Warnings.length > 0) {
				return {
					details: mp3Warnings.map(m => {
						return {reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString()};
					})
				};
			}
		} else if (isFlac(track) && tagCache.flacWarnings) {
			return {details: [{reason: tagCache.flacWarnings}]};
		}
	}

}

export class TrackValidID3v2Rule extends TrackRule {

	constructor() {
		super('track.id3v2.valid', 'Track ID3v2 is invalid');
	}

	async run(track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined> {
		if (isMP3(track) && tagCache.id3v2Warnings && tagCache.id3v2Warnings.length > 0) {
			return {
				details: tagCache.id3v2Warnings.map(m => {
					return {reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString()};
				})
			};
		}
	}

}

export class TrackMissingVBRHeaderRule extends TrackRule {

	constructor() {
		super('track.mp3.vbr.header.missing', 'MP3 File is missing a VBR Header');
	}

	async run(track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined> {
		if (isMP3(track) && tagCache.mp3Warnings && tagCache.mp3Warnings.length > 0) {
			const warning = tagCache.mp3Warnings.find(m => {
				return m.msg === 'XING: VBR detected, but no VBR head frame found';
			});
			if (warning) {
				return {};
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

	async run(track: Track, parent: Folder, root: Root, mediaCache: MediaCache): Promise<RuleResult | undefined> {
		if (mediaCache.id3v2) {
			const frames = mediaCache.id3v2.frames.filter(frame => GARBAGE_FRAMES_IDS.indexOf(frame.id) >= 0);
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
		this.rules.push(new TrackMissingVBRHeaderRule());
		this.rules.push(new TrackValidID3v2Rule());
		this.rules.push(new TrackID3v2GarbageRule());
	}

	async run(track: Track, parent: Folder, root: Root, checkMedia: boolean): Promise<Array<Jam.HealthHint>> {
		const result: Array<Jam.HealthHint> = [];
		const mediaCache: MediaCache = {};
		const filename = track.path + track.name;
		if (checkMedia) {
			if (isMP3(track)) {
				log.debug('Check MPEG', filename);
				const mp3ana = new MP3Analyzer();
				const ana = await mp3ana.read(filename, {id3v1: false, id3v2: false, mpeg: true, xing: true, ignoreXingOffOne: true});
				mediaCache.id3v1 = ana.tags.id3v1;
				mediaCache.id3v2 = ana.tags.id3v2;
				mediaCache.mp3Warnings = ana.msgs;
				if (ana.tags.id3v2) {
					mediaCache.id3v2Warnings = mp3ana.analyseID3v2(ana.tags.id3v2);
				}
			} else {
				log.debug('Check Media with flac', filename);
				mediaCache.flacWarnings = await flac_test(filename);
			}
		} else {
			if (isMP3(track)) {
				log.debug('Read full tag', filename);
				const id3v2 = new ID3v2();
				mediaCache.id3v2 = await id3v2.read(filename);
				if (mediaCache.id3v2) {
					const mp3ana = new MP3Analyzer();
					mediaCache.id3v2Warnings = mp3ana.analyseID3v2(mediaCache.id3v2);
				}
			}
		}
		log.debug('Analyzing track', filename);
		for (const rule of this.rules) {
			const match = await rule.run(track, parent, root, mediaCache);
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
