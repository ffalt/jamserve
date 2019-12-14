import {AudioFormatType, TrackTagFormatType} from '../../model/jam-types';
import {DBObject} from '../base/base.model';

export interface Track extends DBObject {
	rootID: string;
	parentID: string;
	name: string;
	path: string;
	stat: {
		created: number;
		modified: number;
		size: number;
	};
	seriesID?: string;
	albumID: string;
	artistID: string;
	albumArtistID: string;
	tag: TrackTag;
	media: TrackMedia;
}

export interface TrackTagChapter {
	start: number;
	end: number;
	title?: string;
}

export interface TrackTag {
	format: TrackTagFormatType;
	album?: string;
	albumSort?: string;
	albumArtist?: string;
	albumArtistSort?: string;
	artist?: string;
	artistSort?: string;
	genre?: string;
	disc?: number;
	discTotal?: number;
	title?: string;
	titleSort?: string;
	track?: number;
	trackTotal?: number;
	year?: number;
	nrTagImages?: number;
	mbTrackID?: string;
	mbAlbumType?: string;
	mbAlbumArtistID?: string;
	mbArtistID?: string;
	mbAlbumID?: string;
	mbReleaseTrackID?: string;
	mbReleaseGroupID?: string;
	mbRecordingID?: string;
	mbAlbumStatus?: string;
	mbReleaseCountry?: string;
	series?: string;
	seriesNr?: string;
	lyrics?: string;
	chapters?: Array<TrackTagChapter>;
}

export interface TrackMedia {
	duration?: number;
	bitRate?: number;
	format?: AudioFormatType;
	sampleRate?: number;
	channels?: number;
	encoded?: string; // VBR || CBR || ''
	mode?: string; // 'joint', 'dual', 'single'
	version?: string;
}
