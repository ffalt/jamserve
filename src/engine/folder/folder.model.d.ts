import {AlbumType, ArtworkImageType, FolderType} from '../../model/jam-types';
import {DBObject} from '../base/base.model';

export interface Folder extends DBObject {
	rootID: string;
	path: string;
	parentID?: string;
	stat: {
		created: number;
		modified: number;
	};
	tag: FolderTag;
}

export interface ArtworkImage {
	width?: number;
	height?: number;
	format?: string;
}

export interface Artwork {
	id: string;
	name: string;
	types: Array<ArtworkImageType>;
	image: ArtworkImage;
	stat: {
		created: number;
		modified: number;
		size: number;
	};
}

export interface FolderTag {
	level: number;
	trackCount: number;
	folderCount: number;
	type: FolderType;
	genres?: Array<string>;
	album?: string;
	artist?: string;
	artistSort?: string;
	albumType?: AlbumType;
	albumTrackCount?: number;
	title?: string;
	year?: number;
	mbReleaseID?: string;
	mbReleaseGroupID?: string;
	mbAlbumType?: string;
	mbArtistID?: string;
	artworks?: Array<Artwork>;
}
