// LASTFM API Version 2.0

export declare namespace LastFM {

	export interface Tag {
		name: string;
		url: string;
	}

	export interface ArtistInfo {
		name: string;
		mbid: string;
		url: string;
	}

	export interface Image {
		url: string;
		size: string; // "small", "medium", "large", "extralarge", "mega", ""
	}

	export interface Track {
		name: string;
		url: string;
		duration: string;
		playcount: string;
		mbid: string;
		match: string;
		rank: string;
		streamable: Streamable;
		artist: ArtistInfo;
	}

	export interface Track {
		artist: ArtistInfo;
		image: Array<Image>;
	}

	export interface Wiki {
		published: string;
		summary: string;
		content: string;
	}

	export interface Album {
		name: string;
		artist: string;
		mbid: string;
		url: string;
		image: Array<Image>;
		listeners: string;
		playcount: string;
		tracks: Array<Track>;
		tags?: Array<Tag>;
		wiki?: Wiki;
	}

	export interface Streamable {
		sample: string;
		fulltrack: string;
	}

	export interface TopTrack {
		name: string;
		mbid: string;
		url: string;
		streamable: string;
		playcount: number;
		listeners: number;
		image: Array<Image>;
		artist: ArtistInfo;
		rank: string;
	}

	interface Link {
		url: string;
		rel: string;
		href: string;
	}

	export interface Biography {
		published: string;
		summary: string;
		content: string;
		links?: Array<Link>;
	}

	export interface Stats {
		listeners: string;
		playcount: string;
	}

	export interface Artist {
		name: string;
		mbid: string;
		url: string;
		image: Array<Image>;
		streamable: string;
		ontour: string;
		stats?: Stats;
		tags: Array<Tag>;
		bio?: Biography;
		similar?: SimilarArtists;
	}

	export interface SimilarArtist {
		name: string;
		mbid: string;
		url: string;
		image: Array<Image>;
	}

	export interface SimilarArtists {
		artist?: Array<SimilarArtist>;
	}

	export interface TopTracks {
		track: Array<TopTrack>;
		artist: string;
	}

	export interface SimilarTracks {
		track: Array<Track>;
		artist: string;
	}

	interface Result {
		similartracks?: SimilarTracks;
		toptracks?: TopTracks;
		artist?: Artist;
		album?: Album;
		track?: Track;
	}
}
