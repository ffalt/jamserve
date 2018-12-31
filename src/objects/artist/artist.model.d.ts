import {DBObject} from '../base/base.model';
import {MetaInfo} from '../../modules/audio/metadata.model';
import {AlbumType} from '../../model/jam-types';

export interface Artist extends DBObject {
	name: string;
	nameSort?: string;
	rootIDs: Array<string>;
	trackIDs: Array<string>;
	albumIDs: Array<string>;
	albumTypes: Array<AlbumType>;
	mbArtistID?: string;
	info?: MetaInfo;
	created: number;
}
