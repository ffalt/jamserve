import {DBObject} from '../base/base.model';
import {MetaInfo} from '../../engine/metadata/metadata.model';

export interface Album extends DBObject {
	name: string;
	rootIDs: Array<string>;
	trackIDs: Array<string>;
	artistID: string;
	artist?: string;
	genre?: string;
	year?: number;
	duration: number;
	created: number;
	mbArtistID?: string;
	mbAlbumID?: string;
	info?: MetaInfo;
}
