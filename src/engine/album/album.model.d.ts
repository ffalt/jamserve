import {AlbumType} from '../../model/jam-types';
import {DBObject} from '../base/base.model';

export interface Album extends DBObject {
	slug: string;
	name: string;
	rootIDs: Array<string>;
	trackIDs: Array<string>;
	folderIDs: Array<string>;
	albumType: AlbumType;
	artistID: string;
	artist?: string;
	genre?: string;
	year?: number;
	duration: number;
	created: number;
	mbArtistID?: string;
	mbAlbumID?: string;
}
