import {Album} from '../../album/album.model';
import {Artist} from '../../artist/artist.model';
import {Folder} from '../../folder/folder.model';
import {Series} from '../../series/series.model';
import {Track} from '../../track/track.model';

export interface MergeChangesTrackInfo {
	track: Track;
	oldTrack: Track;
}

export interface Changes {
	newArtists: Array<Artist>;
	updateArtists: Array<Artist>;
	removedArtists: Array<Artist>;

	newAlbums: Array<Album>;
	updateAlbums: Array<Album>;
	removedAlbums: Array<Album>;

	newTracks: Array<Track>;
	updateTracks: Array<MergeChangesTrackInfo>;
	removedTracks: Array<Track>;

	newFolders: Array<Folder>;
	updateFolders: Array<Folder>;
	removedFolders: Array<Folder>;

	newSeries: Array<Series>;
	updateSeries: Array<Series>;
	removedSeries: Array<Series>;

	start: number;
	end: number;
}

export function emptyChanges(): Changes {
	const changes: Changes = {
		newArtists: [],
		updateArtists: [],
		removedArtists: [],

		newAlbums: [],
		updateAlbums: [],
		removedAlbums: [],

		newTracks: [],
		updateTracks: [],
		removedTracks: [],

		newSeries: [],
		updateSeries: [],
		removedSeries: [],

		newFolders: [],
		updateFolders: [],
		removedFolders: [],
		start: Date.now(),
		end: 0
	};
	return changes;
}
