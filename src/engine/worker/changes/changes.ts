import moment from 'moment';
import {logger} from '../../../utils/logger';
import {Album} from '../../album/album.model';
import {Artist} from '../../artist/artist.model';
import {Folder} from '../../folder/folder.model';
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

	start: number;
	end: number;
}
