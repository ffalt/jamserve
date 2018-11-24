import {Jam} from '../../model/jam-rest-data-0.1.0';
import {ArtistIndex, FolderIndex} from './index.model';

export function formatArtistIndex(index: ArtistIndex): Jam.ArtistIndex {
	return {
		lastModified: index.lastModified,
		groups: index.groups.map(i => ({
			name: i.name,
			entries: i.entries.map(e => {
				return {
					name: e.artist.name,
					trackCount: e.artist.trackIDs.length,
					albumCount: e.artist.albumIDs.length,
					artistID: e.artist.id
				};
			})
		}))
	};
}

export function formatFolderIndex(index: FolderIndex): Jam.FolderIndex {
	return {
		lastModified: index.lastModified,
		groups: index.groups.map(i => ({
			name: i.name,
			entries: i.entries.map(e => {
				return {
					name: e.name,
					trackCount: e.trackCount,
					folderID: e.folder.id
				};
			})
		}))
	};
}
