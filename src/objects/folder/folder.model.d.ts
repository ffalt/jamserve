import {DBObject} from '../base/base.model';
import {AlbumType, FolderType} from '../../model/jam-types';
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
	image?: string;
	year?: number;
	mbAlbumID?: string;
	mbReleaseGroupID?: string;
	mbAlbumType?: string;
	mbArtistID?: string;
}
