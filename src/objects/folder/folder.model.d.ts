import {DBObject} from '../base/base.model';
import {AlbumType, ArtworkImageType, FolderType} from '../../model/jam-types';
import {MetaInfo} from '../../modules/audio/metadata.model';

export interface Folder extends DBObject {
	rootID: string;
	path: string;
	parentID?: string;
	stat: {
		created: number;
		modified: number;
	};
	tag: FolderTag;
	info?: MetaInfo;
}

export interface Artwork {
	id: string;
	name: string;
	types: Array<ArtworkImageType>;
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
	genre?: string;
	album?: string;
	artist?: string;
	artistSort?: string;
	albumType?: AlbumType;
	title?: string;
	year?: number;
	mbAlbumID?: string;
	mbReleaseGroupID?: string;
	mbAlbumType?: string;
	mbArtistID?: string;
	image?: string;
	artworks?: Array<Artwork>;
}
