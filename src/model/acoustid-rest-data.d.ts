// Acoustid API Version 2.0

export declare namespace Acoustid {

	export interface Artist {
		id: string;
		name: string;
	}

	export interface Track {
		position: number;
		artists: Artist[];
		id: string;
		title: string;
	}

	export interface Medium {
		position: number;
		tracks: Track[];
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
		mediums: Medium[];
		id: string;
		track_count: number;
		medium_count: number;
		releaseevents: Releaseevent[];
		country: string;
		date: AcousticDate;
		title: string;
	}

	export interface Releasegroup {
		id: string;
		releases: Release[];
		title: string;
		secondarytypes: string[];
		type: string;
		artists: Artist[];
	}

	export interface Recording {
		id: string;
		sources: number;
		artists: Artist[];
		duration: number;
		releasegroups: Releasegroup[];
		title: string;
	}

	export interface Result {
		recordings: Recording[];
		score: number;
		id: string;
	}

	export interface Results {
		status: string;
		results: Result[];
	}

}
