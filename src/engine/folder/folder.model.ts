import {DBObject} from '../base/base.model';
import {AlbumType, FolderType} from '../../types';
import {MetaInfo} from '../metadata/metadata.model';

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
	tracks: number;
	level: number;
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
	mbArtistID?: string;
}
