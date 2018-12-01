import {MusicBrainz} from '../../model/musicbrainz-rest-data-2.0';
import {Folder} from '../../objects/folder/folder.model';
import {Artist} from '../../components/artist/artist.model';

export interface MetaInfo {
	album: MetaInfoAlbum;
	artist: MetaInfoArtist;
	topSongs: Array<MetaInfoTopSong>;
}

export interface MetaInfoSimilarArtist {
	name?: string;
	url?: string;
	mbid?: string;
	image?: MetaInfoImage;
}

export interface MetaInfoImage {
	small?: string;
	medium?: string;
	large?: string;
}

export interface MetaInfoArtist {
	name?: string;
	mbid?: string;
	url?: string;
	image?: MetaInfoImage;
	tags?: Array<{ name: string; url: string; }>;
	description?: string;
	similar?: Array<MetaInfoSimilarArtist>;
}

export interface MetaInfoTopSong {
	name: string;
	artist: { name: string; mbid: string; url: string; };
	mbid?: string;
	url?: string;
	rank?: string;
	image?: MetaInfoImage;
}

export interface MetaInfoAlbum {
	name?: string;
	artist?: string;
	mbid?: string;
	url?: string;
	image?: {
		small?: string;
		medium?: string;
		large?: string;
	};
	tags?: Array<{
		name: string;
		url: string;
	}>;
	description?: string;
	releases?: Array<MusicBrainz.Release>;
}

export interface MetaInfoTrack {
	similar: Array<MetaInfoTrackSimilarSong>;
}

export interface MetaInfoTrackSimilarSong {
	name: string;
	mbid?: string;
	url?: string;
	duration?: number;
	artist: { name: string; mbid: string; url: string; };
	image?: MetaInfoImage;
}

export interface MetaInfoFolderSimilarArtist {
	name: string;
	folder?: Folder;
}

export interface MetaInfoArtistSimilarArtist {
	name: string;
	artist?: Artist;
}
