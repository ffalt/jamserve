import {AlbumType} from '../../model/jam-types';
import {DBObject} from '../base/base.model';

export interface Artist extends DBObject {
	slug: string;
	name: string;
	nameSort?: string;
	rootIDs: Array<string>;
	trackIDs: Array<string>;
	folderIDs: Array<string>;
	albumIDs: Array<string>;
	seriesIDs: Array<string>;
	albumTypes: Array<AlbumType>;
	mbArtistID?: string;
	genres?: Array<string>;
	created: number;
}
