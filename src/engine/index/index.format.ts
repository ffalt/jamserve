import {Jam} from '../../model/jam-rest-data';
import {AlbumIndex, ArtistIndex, FolderIndex, SeriesIndex} from './index.model';

export function formatSeriesIndex(index: SeriesIndex): Jam.SeriesIndex {
	return {
		lastModified: index.lastModified,
		groups: index.groups.map(i => ({
			name: i.name,
			entries: i.entries.map(e => {
				return {
					name: e.series.name,
					trackCount: e.series.trackIDs.length,
					albumCount: e.series.albumIDs.length,
					seriesID: e.series.id
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

export function formatAlbumIndex(index: AlbumIndex): Jam.AlbumIndex {
	return {
		lastModified: index.lastModified,
		groups: index.groups.map(i => ({
			name: i.name,
			entries: i.entries.map(e => {
				return {
					id: e.album.id,
					name: e.album.name,
					artist: e.album.artist || '',
					artistID: e.album.artistID,
					trackCount: e.album.trackIDs.length
				};
			})
		}))
	};
}
