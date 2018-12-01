import {Folder} from '../../objects/folder/folder.model';
import {Artist} from '../../components/artist/artist.model';

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

export interface Indexes {
	folderIndex: FolderIndex;
	artistIndex: ArtistIndex;
}
