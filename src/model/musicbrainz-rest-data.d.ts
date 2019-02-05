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
		disambiguation?: string;
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
		aliases?: Array<Alias>;
		tags?: Array<Tag>;
	}

	export interface ReleaseGroup extends ReleaseGroupBase {
		releases?: Array<Release>;
		score?: number;
		count?: number;
	}

	export interface ArtistBase {
		id: string;
		name: string;
		sortName: string;
		disambiguation: string;
		aliases: Array<Alias>;
	}

	export interface Work {
		id: string;
		title: string;
		disambiguation: string;
		language: string;
		languages: Array<string>;
		iswcs: Array<string>;
		attributes: Array<any>;
		aliases: Array<Alias>;
	}

	export interface Area {
		id: string;
		name: string;
		sortName: string;
		disambiguation: string;
		iso31661Codes?: Array<string>;
	}

	export interface Url {
		id: string;
		resource: string;
	}

	export interface Relation {
		direction: string;
		attributeValues?: {};
		targetCredit?: string;
		targetType: string;
		sourceCredit?: string;
		type: string;
		typeId: string;
		ended: boolean;
		attributes?: Array<string>;
		end?: string;
		attributeIds?: {
			original?: string;
		};
		url?: Url;
		artist?: ArtistBase;
		begin: string;
	}

	export interface Artist extends ArtistBase {
		country?: string;
		gender?: string;
		genderId?: string;
		type: string;
		typeId: string;
		lifeSpan: {
			begin: string;
			ended: boolean;
			end?: string;
		};
		releaseGroups?: Array<ReleaseGroupBase>;
		recordings?: Array<RecordingBase>;
		releases?: Array<ReleaseBase>;
		relations?: Array<Relation>;
		begin_area: Area;
		area: Area;
		rating?: Rating;
		ipis: Array<string>;
		isnis: Array<string>;
		works?: Array<Work>;
		tags?: Array<Tag>;
	}

	export interface ArtistCredit {
		name: string;
		joinphrase: string;
		artist: ArtistBase;
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

	export interface Tag {
		count: number;
		name: string;
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
		// trackCount: number;
		artistCredit: Array<ArtistCredit>;
		releaseGroup: ReleaseGroupBase;
		labelInfo: Array<Label>;
		tags?: Array<Tag>;
		releaseEvents: Array<ReleaseEvent>;
		relations?: Array<Relation>;
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
		artist?: Artist;
		artists?: Array<Artist>;
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

