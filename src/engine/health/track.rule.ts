import {ID3v2, IID3V1, IID3V2, IMP3Warning, MP3Analyzer} from 'jamp3';
import {Jam} from '../../model/jam-rest-data';
import {AlbumType, AlbumTypesArtistMusic, AudioFormatType, TrackHealthID} from '../../model/jam-types';
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

const headererrors = [
	'XING: Wrong number of data bytes declared in VBRI Header',
	'XING: Wrong number of frames declared in VBRI Header',
	'XING: Wrong number of data bytes declared in Info Header',
	'XING: Wrong number of frames declared in Info Header',
	'XING: Wrong number of data bytes declared in Xing Header',
	'XING: Wrong number of frames declared in Xing Header'
];
const fixable = ['XING: VBR detected, but no VBR head frame found'].concat(headererrors);

interface TrackRuleInfo {
	id: string;
	name: string;
	all?: boolean;
	mp3?: boolean;
	flac?: boolean;

	run(track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined>;
}

const trackRules: Array<TrackRuleInfo> = [
	{
		id: TrackHealthID.tagValuesExists,
		name: 'Tag Values missing',
		all: true,
		run: async (track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined> => {
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
			if (parent.tag.albumType !== undefined && parent.tag.albumType !== AlbumType.audiodrama) {
				if (!track.tag.trackTotal) {
					missing.push('total track count');
				}
			}
			if (parent.tag.albumType !== undefined && AlbumTypesArtistMusic.includes(parent.tag.albumType)) {
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

	},
	{
		id: TrackHealthID.id3v2Exists,
		name: 'ID3v2 Tag is missing',
		mp3: true,
		run: async (track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (!hasID3v2Tag(track)) {
				return {};
			}
		}
	},
	{
		id: TrackHealthID.id3v2Valid,
		name: 'ID3v2 is invalid',
		mp3: true,
		run: async (track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (tagCache.id3v2Warnings && tagCache.id3v2Warnings.length > 0) {
				return {
					details: tagCache.id3v2Warnings.map(m => {
						return {reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString()};
					})
				};
			}
		}
	},
	{
		id: TrackHealthID.id3v2Garbage,
		name: 'ID3v2 has garbage frames',
		mp3: true,
		run: async (track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (tagCache.id3v2) {
				const frames = tagCache.id3v2.frames.filter(frame => GARBAGE_FRAMES_IDS.includes(frame.id));
				if (frames.length > 0) {
					const ids: Array<string> = [];
					frames.forEach(frame => {
						if (!ids.includes(frame.id)) {
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
	},
	{
		id: TrackHealthID.mp3HeaderExists,
		name: 'VBR Header is missing',
		mp3: true,
		run: async (track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (tagCache.mp3Warnings && tagCache.mp3Warnings.length > 0) {
				const warning = tagCache.mp3Warnings.find(m => {
					return m.msg === 'XING: VBR detected, but no VBR head frame found';
				});
				if (warning) {
					return {};
				}
			}
		}
	},
	{
		id: TrackHealthID.mp3HeaderValid,
		name: 'VBR Header is invalid',
		mp3: true,
		run: async (track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (tagCache.mp3Warnings && tagCache.mp3Warnings.length > 0) {
				const warnings = tagCache.mp3Warnings.filter(m => {
					return headererrors.includes(m.msg);
				});
				if (warnings.length > 0) {
					return {
						details: warnings.map(m => {
							return {reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString()};
						})
					};
				}
			}
		}
	},
	{
		id: TrackHealthID.mp3MediaValid,
		name: 'MP3 Media is invalid',
		mp3: true,
		run: async (track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (tagCache.mp3Warnings && tagCache.mp3Warnings.length > 0) {
				const mp3Warnings = tagCache.mp3Warnings.filter(m => !fixable.includes(m.msg));
				if (mp3Warnings.length > 0) {
					return {
						details: mp3Warnings.map(m => {
							return {reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString()};
						})
					};
				}
			}
		}
	},
	{
		id: TrackHealthID.flacMediaValid,
		name: 'Flac Media is invalid',
		mp3: true,
		run: async (track: Track, parent: Folder, root: Root, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (tagCache.flacWarnings) {
				return {details: [{reason: tagCache.flacWarnings}]};
			}
		}
	}
];

function hasID3v2Tag(track: Track): boolean {
	return ID3TrackTagRawFormatTypes.includes(track.tag.format);
}

function isMP3(track: Track): boolean {
	return track.media && track.media.format === AudioFormatType.mp3;
}

function isFlac(track: Track): boolean {
	return track.media && track.media.format === AudioFormatType.flac;
}

const GARBAGE_FRAMES_IDS: Array<string> = [
	'PRIV', // application specific binary, mostly windows media player
	'COMM',
	'POPM'
];

export class TrackRulesChecker {

	constructor() {
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
		const mp3 = isMP3(track);
		const flac = isFlac(track);
		for (const rule of trackRules) {
			if (rule.all || (rule.mp3 && mp3) || (rule.flac && flac)) {
				const match = await rule.run(track, parent, root, mediaCache);
				if (match) {
					result.push({
						id: rule.id,
						name: rule.name,
						details: match.details
					});
				}
			}
		}
		return result;
	}

}
