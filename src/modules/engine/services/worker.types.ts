import {ArtworkImageType, RootScanStrategy, TrackHealthID} from '../../../types/enums';
import {RawTag} from '../../audio/rawTag';

export interface WorkerRequestParameters {
	rootID: string;
}

export interface WorkerRequestMoveArtworks extends WorkerRequestParameters {
	artworkIDs: Array<string>;
	newParentID: string;
}

export interface WorkerRequestMoveTracks extends WorkerRequestParameters {
	trackIDs: Array<string>;
	newParentID: string;
}

export interface WorkerRequestRenameTrack extends WorkerRequestParameters {
	trackID: string;
	newName: string;
}

export interface WorkerRequestFixTrack extends WorkerRequestParameters {
	fixes: Array<{ trackID: string; fixID: TrackHealthID }>;
}

export interface WorkerRequestRenameFolder extends WorkerRequestParameters {
	folderID: string;
	newName: string;
}

export interface WorkerRequestCreateFolder extends WorkerRequestParameters {
	parentID: string;
	name: string;
}

export interface WorkerRequestUpdateRoot extends WorkerRequestParameters {
	name: string;
	path: string;
	strategy: RootScanStrategy;
}

export interface WorkerRequestCreateRoot extends WorkerRequestParameters {
	path: string;
	name: string;
	strategy: RootScanStrategy;
}

export interface WorkerRequestWriteTrackTags extends WorkerRequestParameters {
	tags: Array<{ trackID: string; tag: RawTag }>;
}

export type WorkerRequestRefreshRoot = WorkerRequestParameters;
export type WorkerRequestRefreshRootMeta = WorkerRequestParameters;

export interface WorkerRequestRefreshFolders extends WorkerRequestParameters {
	folderIDs: Array<string>;
}

export interface WorkerRequestMoveFolders extends WorkerRequestParameters {
	newParentID: string;
	folderIDs: Array<string>;
}

export type WorkerRequestRemoveRoot = WorkerRequestParameters;

export interface WorkerRequestRefreshTracks extends WorkerRequestParameters {
	trackIDs: Array<string>;
}

export interface WorkerRequestRemoveTracks extends WorkerRequestParameters {
	trackIDs: Array<string>;
}

export interface WorkerRequestDeleteFolders extends WorkerRequestParameters {
	folderIDs: Array<string>;
}

export interface WorkerRequestRemoveArtwork extends WorkerRequestParameters {
	artworkID: string;
}

export interface WorkerRequestDownloadArtwork extends WorkerRequestParameters {
	folderID: string;
	artworkURL: string;
	types: Array<ArtworkImageType>;
}

export interface WorkerRequestReplaceArtwork extends WorkerRequestParameters {
	artworkID: string;
	artworkFilename: string;
}

export interface WorkerRequestCreateArtwork extends WorkerRequestParameters {
	folderID: string;
	artworkFilename: string;
	types: Array<ArtworkImageType>;
}

export interface WorkerRequestRenameArtwork extends WorkerRequestParameters {
	artworkID: string;
	newName: string;
}
