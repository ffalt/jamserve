import {WikiData} from '../../modules/audio/clients/wikidata-rest-data.js';

export enum MetaDataType {
	musicbrainz,
	wikipedia,
	wikidata,
	acoustid,
	acousticbrainz,
	coverartarchive,
	lastfm,
	lyrics
}


export interface WikipediaSummary {
	title: string;
	summary: string;
	url: string;
}

export interface WikipediaSummaryResponse {
	summary?: WikipediaSummary;
}

export interface WikidataLookupResponse {
	entity?: WikiData.Entity;
	data?: WikiData.Entity;
}

