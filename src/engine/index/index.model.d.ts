import {Album} from '../../objects/album/album.model';
import {Artist} from '../../objects/artist/artist.model';
import {Folder} from '../../objects/folder/folder.model';

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

export interface ArtistIndexEntry {
	artist: Artist;
}

export interface ArtistIndexGroup {
	name: string;
	entries: Array<ArtistIndexEntry>;
}

export interface ArtistIndex {
	lastModified: number;
	groups: Array<ArtistIndexGroup>;
}

export interface AlbumIndexEntry {
	album: Album;
}

export interface AlbumIndexGroup {
	name: string;
	entries: Array<AlbumIndexEntry>;
}

export interface AlbumIndex {
	lastModified: number;
	groups: Array<AlbumIndexGroup>;
}
