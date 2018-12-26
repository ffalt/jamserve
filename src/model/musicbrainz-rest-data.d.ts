// Musicbrainz API Version 2.0

export declare namespace MusicBrainz {

	export interface Rating {
		votesCount: number;
		value: number;
	}

	export interface Alias {
		name: string;
		sortName?: string;
		locale?: string;
		type?: string;
		typeId?: string;
		primary?: string;
		beginDate?: string;
		endDate?: string;
		ended: boolean;
	}

	export interface RecordingBase {
		id: string;
		title: string;
		disambiguation: string;
		length: number;
		video: boolean;
		rating?: Rating;
		aliases?: Array<Alias>;
		artistCredit?: Array<ArtistCredit>;
		isrcs?: Array<string>;
	}

	export interface Recording extends RecordingBase {
		releases?: Array<Release>;
		score?: number;
		count?: number;
	}

	export interface ReleaseTrack {
		id: string;
		title: string;
		position: number;
		length: number;
		number: string;
		recording?: RecordingBase;
		artistCredit?: Array<ArtistCredit>;
	}

	export interface Disc {
		id: string;
		sectors: number;
		offsetCount: number;
		offsets: Array<number>;
	}

	export interface ReleaseMedia {
		format: string;
		formatId?: string;
		title?: string;
		discCount: number;
		trackCount: number;
		position: number;
		trackOffset: number;
		tracks?: Array<ReleaseTrack>;
		discs?: Array<Disc>;
	}

	export interface ReleaseEvent {
		date: string;
		area: {
			id: string;
			name: string;
			sortName: string;
			disambiguation?: string;
			iso31661Codes: Array<string>;
		};
	}

	export interface ReleaseGroupBase {
		id: string;
		title: string;
		disambiguation?: string;
		firstReleaseDate?: string;
		primaryType: string;
		primaryTypeId?: string;
		secondaryTypes?: Array<string>;
		secondaryTypeIds?: Array<string>;
		rating?: Rating;
		artistCredit?: Array<ArtistCredit>;
	}

	export interface ReleaseGroup extends ReleaseGroupBase {
		releases?: Array<Release>;
		score?: number;
		count?: number;
	}

	export interface ArtistCredit {
		name: string;
		joinphrase: string;
		artist: {
			id: string;
			name: string;
			sortName: string;
			disambiguation: string;
			aliases: Array<Alias>;
		};
	}

	export interface Label {
		catalogNumber: string;
		label: {
			id: string;
			name: string;
			disambiguation?: string;
			labelCode?: string;
			sortName?: string;
		};
		aliases: Array<{
			name: string;
			sortName: string;
			ended: boolean;
		}>;
	}

	export interface ReleaseBase {
		id: string;
		title: string;
		sortName: string;
		status: string;
		statusId?: string;
		date?: string;
		country?: string;
		packaging?: string;
		packagingId?: string;
		disambiguation?: string;
		annotation?: string;
		quality?: string;
		barcode?: string;
		asin?: string;
		textRepresentation: {
			language: string;
			script: string;
		};
		trackCount: number;
		artistCredit: Array<ArtistCredit>;
		releaseGroup: ReleaseGroupBase;
		labelInfo: Array<Label>;
		tags: Array<{
			count: number;
			name: string;
		}>;
		releaseEvents: Array<ReleaseEvent>;
		coverArtArchive?: {
			front: boolean;
			back: boolean;
			darkened: boolean;
			artwork: boolean;
			count: number;
		};
	}

	export interface Release extends ReleaseBase {
		media: Array<ReleaseMedia>;
		score?: number;
		count?: number;
	}

	export interface Response {
		release?: Release;
		releases?: Array<Release>;
		releaseGroup?: ReleaseGroup;
		releaseGroups?: Array<ReleaseGroup>;
		recording?: Recording;
		recordings?: Array<Recording>;
		count?: number;
		offset?: number;
		created?: string;
	}
}

