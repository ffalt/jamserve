import {AlbumType} from '../../model/jam-types';
import {DBObject} from '../base/base.model';

export interface Series extends DBObject {
	name: string;
	artist: string;
	artistID: string;
	rootIDs: Array<string>;
	albumIDs: Array<string>;
	folderIDs: Array<string>;
	trackIDs: Array<string>;
	albumTypes: Array<AlbumType>;
	created: number;
}
