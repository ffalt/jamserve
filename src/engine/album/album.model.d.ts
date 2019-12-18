import {AlbumType} from '../../model/jam-types';
import {DBObject} from '../base/base.model';

export interface Album extends DBObject {
	slug: string;
	name: string;
	genres: Array<string>;
	rootIDs: Array<string>;
	trackIDs: Array<string>;
	folderIDs: Array<string>;
	albumType: AlbumType;
	series?: string;
	seriesID?: string;
	seriesNr?: string;
	artistID: string;
	artist?: string;
	year?: number;
	duration: number;
	created: number;
	mbArtistID?: string;
	mbReleaseID?: string;
}
