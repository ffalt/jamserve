import {Album} from '../album/album.model';
import {Artist} from '../artist/artist.model';
import {Folder} from '../folder/folder.model';
import {Series} from '../series/series.model';

export interface FolderIndexEntry {
	name: string;
	nameSort: string;
	trackCount: number;
	folder: Folder;
}

export interface FolderIndexGroup {
	name: string;
	entries: Array<FolderIndexEntry>;
}

export interface FolderIndex {
	lastModified: number;
	groups: Array<FolderIndexGroup>;
}

export interface ArtistIndexGroup {
	name: string;
	entries: Array<Artist>;
}

export interface ArtistIndex {
	lastModified: number;
	groups: Array<ArtistIndexGroup>;
}

export interface AlbumIndexGroup {
	name: string;
	entries: Array<Album>;
}

export interface AlbumIndex {
	lastModified: number;
	groups: Array<AlbumIndexGroup>;
}

export interface SeriesIndexGroup {
	name: string;
	entries: Array<Series>;
}

export interface SeriesIndex {
	lastModified: number;
	groups: Array<SeriesIndexGroup>;
}
