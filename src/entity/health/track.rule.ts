import {ID3v2, IID3V1, IID3V2, IMP3Analyzer} from 'jamp3';
import path from 'path';
import {AudioModule, ID3TrackTagRawFormatTypes} from '../../modules/audio/audio.module';
import {flac_test} from '../../modules/audio/tools/flac';
import {logger} from '../../utils/logger';
import {Track} from '../track/track';
import {RuleResult} from './rule';
import {AlbumTypesArtistMusic, AudioFormatType, TrackHealthID} from '../../types/enums';
import {TrackHealthHint} from './health.model';
import {Tag} from '../tag/tag';
import {Folder} from '../folder/folder';

const log = logger('TrackHealth');

interface MediaCache {
	id3v2?: IID3V2.Tag;
	id3v1?: IID3V1.Tag;
	mp3Warnings?: {
		id3v2: Array<IMP3Analyzer.Warning>;
		id3v1: Array<IMP3Analyzer.Warning>;
		xing: Array<IMP3Analyzer.Warning>;
		mpeg: Array<IMP3Analyzer.Warning>;
	};
	flacWarnings?: string;
}

const analyzeErrors = {
	xing: [
		'XING: Wrong number of data bytes declared in VBRI Header',
		'XING: Wrong number of frames declared in VBRI Header',
		'XING: Wrong number of data bytes declared in Info Header',
		'XING: Wrong number of frames declared in Info Header',
		'XING: Wrong number of data bytes declared in Xing Header',
		'XING: Wrong number of frames declared in Xing Header'
	],
	xingMissing: [
		'XING: VBR detected, but no VBR head frame found'
	],
	mpeg: [
		'MPEG: Unknown data found between ID3v2 and audio',
		'MPEG: Unknown data found before audio'
	]
};

const fixable = analyzeErrors.xingMissing.concat(analyzeErrors.xing).concat(analyzeErrors.mpeg);

const GARBAGE_FRAMES_IDS: Array<string> = [
	'PRIV', // application specific binary, mostly windows media player
	'COMM',
	'POPM'
];

interface TrackRuleInfo {
	id: TrackHealthID;
	name: string;
	all?: boolean;
	mp3?: boolean;
	flac?: boolean;

	run(folder: Folder, track: Track, tag: Tag | undefined, tagCache: MediaCache): Promise<RuleResult | undefined>;
}

function hasID3v2Tag(track: Track, tag?: Tag): boolean {
	return !!tag?.format && ID3TrackTagRawFormatTypes.includes(tag.format);
}

function isMP3(track: Track, tag?: Tag): boolean {
	return !!tag && tag.mediaFormat === AudioFormatType.mp3;
}

function isFlac(track: Track, tag?: Tag): boolean {
	return !!tag && tag.mediaFormat === AudioFormatType.flac;
}

const trackRules: Array<TrackRuleInfo> = [
	{
		id: TrackHealthID.tagValuesExists,
		name: 'Tag Values missing',
		all: true,
		run: async (folder: Folder, track: Track, tag: Tag | undefined): Promise<RuleResult | undefined> => {
			const missing = [];
			if (!tag?.album) {
				missing.push('album');
			}
			if (!tag?.artist) {
				missing.push('artist');
			}
			if (!tag?.albumArtist) {
				missing.push('album artist');
			}
			if (!tag?.genres || tag.genres.length === 0) {
				missing.push('genre');
			}
			if (!tag?.trackNr) {
				missing.push('track nr');
			}
			if (folder.albumType !== undefined && !track.series && !tag?.trackTotal) {
				missing.push('total track count');
			}
			if (folder.albumType !== undefined && AlbumTypesArtistMusic.includes(folder.albumType) && !tag?.year) {
				missing.push('year');
			}
			if (missing.length > 0) {
				return {details: missing.map(m => ({reason: m}))};
			}
		}
	},
	{
		id: TrackHealthID.id3v2NoId3v1,
		name: 'ID3v2 is available, ID3v1 is redundant',
		mp3: true,
		run: async (folder: Folder, track: Track, tag: Tag | undefined, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (hasID3v2Tag(track, tag) && tagCache.id3v1) {
				return {};
			}
		}
	},
	{
		id: TrackHealthID.id3v2Exists,
		name: 'ID3v2 Tag is missing',
		mp3: true,
		run: async (folder: Folder, track: Track, tag: Tag | undefined): Promise<RuleResult | undefined> => {
			if (!hasID3v2Tag(track, tag)) {
				return {};
			}
		}
	},
	{
		id: TrackHealthID.id3v2Valid,
		name: 'ID3v2 is invalid',
		mp3: true,
		run: async (folder: Folder, track: Track, tag: Tag | undefined, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (tagCache.mp3Warnings && tagCache.mp3Warnings.id3v2 && tagCache.mp3Warnings.id3v2.length > 0) {
				return {
					details: tagCache.mp3Warnings.id3v2.map(m => {
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
		run: async (folder: Folder, track: Track, tag: Tag | undefined, tagCache: MediaCache): Promise<RuleResult | undefined> => {
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
		id: TrackHealthID.mp3Garbage,
		name: 'MP3 has unaccounted data',
		mp3: true,
		run: async (folder: Folder, track: Track, tag: Tag | undefined, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (tagCache.mp3Warnings && tagCache.mp3Warnings.mpeg) {
				const warnings = tagCache.mp3Warnings.mpeg.filter(m => analyzeErrors.mpeg.includes(m.msg));
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
		id: TrackHealthID.mp3HeaderExists,
		name: 'VBR Header is missing',
		mp3: true,
		run: async (folder: Folder, track: Track, tag: Tag | undefined, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (tagCache.mp3Warnings && tagCache.mp3Warnings.xing) {
				const warning = tagCache.mp3Warnings.xing.find(m => {
					return analyzeErrors.xingMissing.includes(m.msg);
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
		run: async (folder: Folder, track: Track, tag: Tag | undefined, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (tagCache.mp3Warnings && tagCache.mp3Warnings.xing) {
				const warnings = tagCache.mp3Warnings.xing.filter(m => analyzeErrors.xing.includes(m.msg));
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
		run: async (folder: Folder, track: Track, tag: Tag | undefined, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (tagCache.mp3Warnings && tagCache.mp3Warnings.mpeg) {
				const mp3Warnings = tagCache.mp3Warnings.mpeg.filter(m => !fixable.includes(m.msg));
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
		run: async (folder: Folder, track: Track, tag: Tag | undefined, tagCache: MediaCache): Promise<RuleResult | undefined> => {
			if (tagCache.flacWarnings) {
				return {details: [{reason: tagCache.flacWarnings}]};
			}
		}
	}
];

export class TrackRulesChecker {

	constructor(private audiomodule: AudioModule) {
	}

	async run(track: Track, checkMedia: boolean): Promise<Array<TrackHealthHint>> {
		const result: Array<TrackHealthHint> = [];
		const mediaCache: MediaCache = {};
		const filename = path.join(track.path, track.fileName);
		log.debug('Analyzing track', filename);
		if (checkMedia) {
			if (isMP3(track)) {
				log.debug('Check MPEG', filename);
				const ana = await this.audiomodule.mp3.analyze(filename);
				mediaCache.id3v1 = ana.tags.id3v1;
				mediaCache.id3v2 = ana.tags.id3v2;
				mediaCache.mp3Warnings = {
					xing: ana.warnings.filter(w => w.msg.startsWith('XING:')),
					mpeg: ana.warnings.filter(w => w.msg.startsWith('MPEG:')),
					id3v1: ana.warnings.filter(w => w.msg.startsWith('ID3V1:')),
					id3v2: ana.warnings.filter(w => w.msg.startsWith('ID3V2:'))
				};
			} else {
				log.debug('Check Media with flac', filename);
				mediaCache.flacWarnings = await flac_test(filename);
			}
		} else {
			if (isMP3(track)) {
				const id3v2 = new ID3v2();
				mediaCache.id3v2 = await id3v2.read(filename);
				if (mediaCache.id3v2) {
					mediaCache.mp3Warnings = {
						xing: [],
						mpeg: [],
						id3v1: [],
						id3v2: ID3v2.check(mediaCache.id3v2)
					};
				}
			}
		}
		const folder = await track.folder.getOrFail();
		const tag = await track.tag.get();
		const mp3 = isMP3(track);
		const flac = isFlac(track);
		for (const rule of trackRules) {
			if (rule.all || (rule.mp3 && mp3) || (rule.flac && flac)) {
				const match = await rule.run(folder, track, tag, mediaCache);
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
