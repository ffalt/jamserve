// Discogs API https://www.discogs.com/developers/

export declare namespace Discogs {

	export interface Pagination {
		page: number;
		pages: number;
		per_page: number;
		items: number;
		urls: {
			last?: string;
			next?: string;
		};
	}

	export interface Format {
		name: string;
		qty: string;
		descriptions?: Array<string>;
	}

	export interface Community {
		want: number;
		have: number;
	}

	export interface SearchResult {
		id: number;
		type: string;
		master_id?: number;
		master_url?: string;
		uri: string;
		title: string;
		thumb: string;
		cover_image: string;
		country?: string;
		year?: string;
		format?: Array<string>;
		label?: Array<string>;
		catno?: string;
		barcode?: Array<string>;
		resource_url: string;
		community?: Community;
		formats?: Array<Format>;
		genres?: Array<string>;
		styles?: Array<string>;
	}

	export interface SearchResponse {
		pagination: Pagination;
		results: Array<SearchResult>;
	}

	export interface Image {
		type: string;
		uri: string;
		resource_url: string;
		uri150: string;
		width: number;
		height: number;
	}

	export interface Artist {
		id: number;
		name: string;
		real_name?: string;
		profile?: string;
		urls?: Array<string>;
		namevariations?: Array<string>;
		aliases?: Array<{ id: number; name: string; resource_url: string }>;
		members?: Array<{ id: number; name: string; resource_url: string; active: boolean }>;
		images?: Array<Image>;
		resource_url: string;
		uri: string;
		data_quality: string;
	}

	export interface ArtistCredit {
		id: number;
		name: string;
		anv: string;
		join: string;
		role: string;
		tracks: string;
		resource_url: string;
	}

	export interface TrackListing {
		position: string;
		title: string;
		duration: string;
		type_: string;
		extraartists?: Array<ArtistCredit>;
	}

	export interface Video {
		uri: string;
		title: string;
		description: string;
		duration: number;
		embed: boolean;
	}

	export interface Release {
		id: number;
		title: string;
		artists?: Array<{ id: number; name: string; resource_url: string }>;
		labels?: Array<{ id: number; name: string; catno: string; resource_url: string }>;
		formats?: Array<Format>;
		genres?: Array<string>;
		styles?: Array<string>;
		year?: number;
		country?: string;
		notes?: string;
		tracklist?: Array<TrackListing>;
		images?: Array<Image>;
		resource_url: string;
		uri: string;
		data_quality: string;
		master_id?: number;
		master_url?: string;
	}

	export interface Master {
		id: number;
		title: string;
		artists?: Array<ArtistCredit>;
		genres?: Array<string>;
		styles?: Array<string>;
		year?: number;
		notes?: string;
		num_for_sale?: number;
		lowest_price?: number;
		tracklist?: Array<TrackListing>;
		videos?: Array<Video>;
		images?: Array<Image>;
		resource_url: string;
		uri: string;
		data_quality: string;
		main_release?: number;
		main_release_url?: string;
		most_recent_release?: number;
		most_recent_release_url?: string;
		versions_url?: string;
	}

	export interface MasterVersion {
		id: number;
		title: string;
		status: string;
		format: string;
		label: string;
		catno: string;
		country: string;
		released: string;
		thumb: string;
		resource_url: string;
		major_formats: Array<string>;
		stats: {
			community: { in_collection: number; in_wantlist: number };
			user: { in_collection: number; in_wantlist: number };
		};
	}

	export interface MasterVersionsResponse {
		pagination: Pagination;
		versions: Array<MasterVersion>;
	}
}
