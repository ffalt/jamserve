// AcousticBrainz API Version 1.0

export declare namespace AcousticBrainz {

	export interface Response {
		highlevel?: HighLevel;
		metadata?: MetaData;
	}

	export type KnownSections = 'danceability' | 'gender' | 'genre_dortmund' | 'genre_electronic' | 'genre_rosamerica' | 'genre_tzanetakis' | 'ismir04_rhythm' | 'mood_acoustic' |
		'mood_aggressive' | 'mood_electronic' | 'mood_happy' | 'mood_party' | 'mood_relaxed' | 'mood_sad' | 'moods_mirex' | 'timbre' | 'tonal_atonal' | 'voice_instrumental';

	export interface HighLevelSection {
		all: Record<string, number>;
		probability: number;
		value: string;
		version: Version;
	}

	export interface Version {
		essentia: string;
		essentia_build_sha: string;
		essentia_git_sha: string;
		extractor: string;
		gaia: string;
		gaia_git_sha: string;
		models_essentia_git_sha: string;
	}

	export interface HighLevel {
		danceability?: HighLevelSection;
		gender?: HighLevelSection;
		genre_dortmund?: HighLevelSection;
		genre_electronic?: HighLevelSection;
		genre_rosamerica?: HighLevelSection;
		genre_tzanetakis?: HighLevelSection;
		ismir04_rhythm?: HighLevelSection;
		mood_acoustic?: HighLevelSection;
		mood_aggressive?: HighLevelSection;
		mood_electronic?: HighLevelSection;
		mood_happy?: HighLevelSection;
		mood_party?: HighLevelSection;
		mood_relaxed?: HighLevelSection;
		mood_sad?: HighLevelSection;
		moods_mirex?: HighLevelSection;
		timbre?: HighLevelSection;
		tonal_atonal?: HighLevelSection;
		voice_instrumental?: HighLevelSection;
	}

	export interface MetaData {
		audio_properties: {
			analysis_sample_rate: number;
			bit_rate: number;
			codec: string;
			downmix: string;
			equal_loudness: number;
			length: number;
			lossless: number;
			md5_encoded: string;
			replay_gain: number;
		};
		tags: {
			acoustid_id: Array<string>;
			album: Array<string>;
			albumartist: Array<string>;
			albumartistsort: Array<string>;
			artist: Array<string>;
			artists: Array<string>;
			artistsort: Array<string>;
			asin: Array<string>;
			barcode: Array<string>;
			catalognumber: Array<string>;
			composer: Array<string>;
			composersort: Array<string>;
			date: Array<string>;
			discnumber: Array<string>;
			discsubtitle: Array<string>;
			disctotal: Array<string>;
			engineer: Array<string>;
			file_name: string;
			isrc: Array<string>;
			label: Array<string>;
			language: Array<string>;
			lyricist: Array<string>;
			media: Array<string>;
			mixer: Array<string>;
			musicbrainz_albumartistid: Array<string>;
			musicbrainz_albumid: Array<string>;
			musicbrainz_artistid: Array<string>;
			musicbrainz_recordingid: Array<string>;
			musicbrainz_releasegroupid: Array<string>;
			musicbrainz_releasetrackid: Array<string>;
			musicbrainz_workid: Array<string>;
			originaldate: Array<string>;
			performer: Array<string>;
			producer: Array<string>;
			releasecountry: Array<string>;
			releasestatus: Array<string>;
			releasetype: Array<string>;
			script: Array<string>;
			title: Array<string>;
			totaldiscs: Array<string>;
			totaltracks: Array<string>;
			tracknumber: Array<string>;
			tracktotal: Array<string>;
			work: Array<string>;
		};
		version: {
			highlevel: Version;
			lowlevel: Version;
		};
	}
}
