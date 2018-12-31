import {DBObject} from '../base/base.model';
import {MetaInfo} from '../../modules/audio/metadata.model';
import {AlbumType} from '../../model/jam-types';

export interface Album extends DBObject {
	name: string;
	rootIDs: Array<string>;
	trackIDs: Array<string>;
	albumType: AlbumType;
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
