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
}
