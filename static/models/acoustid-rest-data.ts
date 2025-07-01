// Acoustid API Version 2.0

export declare namespace Acoustid {

	export interface Artist {
		id: string;
		name: string;
	}

	export interface Track {
		position: number;
		artists: Array<Artist>;
		id: string;
		title: string;
	}

	export interface Medium {
		position: number;
		tracks: Array<Track>;
		track_count: number;
		format: string;
		title: string;
	}

	export interface AcousticDate {
		month: number;
		year: number;
		day?: number;
	}

	export interface Releaseevent {
		date: AcousticDate;
		country: string;
	}

	export interface Release {
		mediums: Array<Medium>;
		id: string;
		track_count: number;
		medium_count: number;
		releaseevents: Array<Releaseevent>;
		country: string;
		date: AcousticDate;
		title: string;
	}

	export interface Releasegroup {
		id: string;
		releases: Array<Release>;
		title: string;
		secondarytypes: Array<string>;
		type: string;
		artists: Array<Artist>;
	}

	export interface Recording {
		id: string;
		sources: number;
		artists: Array<Artist>;
		duration: number;
		releasegroups: Array<Releasegroup>;
		title: string;
	}

	export interface Result {
		recordings: Array<Recording>;
		score: number;
		id: string;
	}

	export interface Results {
		status: string;
		results: Array<Result>;
	}
}
