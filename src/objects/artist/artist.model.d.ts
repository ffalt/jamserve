import {DBObject} from '../base/base.model';
import {AlbumType} from '../../model/jam-types';

export interface Artist extends DBObject {
	slug: string;
	name: string;
	nameSort?: string;
	rootIDs: Array<string>;
	trackIDs: Array<string>;
	albumIDs: Array<string>;
	albumTypes: Array<AlbumType>;
	mbArtistID?: string;
	created: number;
}
