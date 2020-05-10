import {Jam} from '../../model/jam-rest-data';
import {AlbumIndex, ArtistIndex, FolderIndex, SeriesIndex} from './index.model';

export function formatSeriesIndex(index: SeriesIndex): Jam.SeriesIndex {
	return {
		lastModified: index.lastModified,
		groups: index.groups.map(i => ({
			name: i.name,
			entries: i.entries.map(e => {
				return {
					name: e.name,
					trackCount: e.trackIDs.length,
					albumCount: e.albumIDs.length,
					seriesID: e.id
				};
			})
		}))
	};
}

export function formatArtistIndex(index: ArtistIndex): Jam.ArtistIndex {
	return {
		lastModified: index.lastModified,
		groups: index.groups.map(i => ({
			name: i.name,
			entries: i.entries.map(e => {
				return {
					name: e.name,
					trackCount: e.trackIDs.length,
					albumCount: e.albumIDs.length,
					artistID: e.id
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

export function formatAlbumIndex(index: AlbumIndex): Jam.AlbumIndex {
	return {
		lastModified: index.lastModified,
		groups: index.groups.map(i => ({
			name: i.name,
			entries: i.entries.map(e => {
				return {
					id: e.id,
					name: e.name,
					artist: e.artist || '',
					artistID: e.artistID,
					trackCount: e.trackIDs.length
				};
			})
		}))
	};
}
