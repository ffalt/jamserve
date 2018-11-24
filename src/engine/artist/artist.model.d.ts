import {DBObject} from '../base/base.model';
import {MetaInfo} from '../metadata/metadata.model';

export interface Artist extends DBObject {
	name: string;
	nameSort?: string;
	rootIDs: Array<string>;
	trackIDs: Array<string>;
	albumIDs: Array<string>;
	mbArtistID?: string;
	info?: MetaInfo;
	created: number;
}
