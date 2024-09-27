import {Base} from '../base/base.model.js';
import {examples} from '../../modules/engine/rest/example.consts.js';
import {JamObjectType} from '../../types/enums.js';
import {GenreBase} from '../genre/genre.model.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';
import {ResultType} from '../../modules/rest/decorators/ResultType.js';

@ResultType({description: 'Media Raw Tag'})
export class MediaTagRaw {
	@ObjField({nullable: true, description: 'Tag Version'})
	version?: number;
	@ObjField(() => Object, {nullable: true, description: 'Tag Frames'})
	frames?: any;
}

@ResultType({description: 'Media Raw Tag'})
export class MediaIDTagRaw extends MediaTagRaw {
	@ObjField({description: 'Media File ID (Track/Episode)', isID: true})
	id!: string;
}

@ResultType({description: 'Media Audio Info'})
export class MediaInfo {
	@ObjField({description: 'Bit Rate', example: 320000})
	bitRate?: number;
	@ObjField({nullable: true, description: 'Media Format', example: 'flac'})
	format?: string;
	@ObjField({nullable: true, description: 'Media Channels', example: 2})
	channels?: number;
	@ObjField({nullable: true, description: 'Sample Rate (Hz)', example: 44100})
	sampleRate?: number;
	@ObjField({nullable: true, description: 'File Size', example: 31321516})
	size?: number;
}

@ResultType({description: 'Media Tag Data'})
export class MediaTag {
	@ObjField({nullable: true, description: 'Title', example: 'Goodbye Sober Day'})
	title?: string;
	@ObjField({nullable: true, description: 'Album Name', example: 'California'})
	album?: string;
	@ObjField({nullable: true, description: 'Artist Name', example: 'Mr. Bungle'})
	artist?: string;
	@ObjField(() => [String], {nullable: true, description: 'Genres', example: examples.genres})
	genres?: Array<string>;
	@ObjField({nullable: true, description: 'Year', example: 1999})
	year?: number;
	@ObjField({nullable: true, description: 'Track Nr', example: 10})
	trackNr?: number;
	@ObjField({nullable: true, description: 'Disc Nr', example: 1})
	disc?: number;
	@ObjField({nullable: true, description: 'Total Nr. of Disc', example: 1})
	discTotal?: number;
	@ObjField({nullable: true, description: 'MusicBrainz Track Id', example: examples.mbTrackID})
	mbTrackID?: string;
	@ObjField({nullable: true, description: 'MusicBrainz Recording Id', example: examples.mbRecordingID})
	mbRecordingID?: string;
	@ObjField({nullable: true, description: 'MusicBrainz Release Track Id', example: examples.mbRecordingTrackID})
	mbReleaseTrackID?: string;
	@ObjField({nullable: true, description: 'MusicBrainz Release Group Id', example: examples.mbReleaseGroupID})
	mbReleaseGroupID?: string;
	@ObjField({nullable: true, description: 'MusicBrainz Release Id', example: examples.mbReleaseID})
	mbReleaseID?: string;
	@ObjField({nullable: true, description: 'MusicBrainz Artist Id', example: examples.mbArtistID})
	mbArtistID?: string;
	@ObjField({nullable: true, description: 'MusicBrainz Album Artist Id', example: examples.mbArtistID})
	mbAlbumArtistID?: string;
}

@ResultType({description: 'Media Base'})
export class MediaBase extends Base {
	@ObjField(() => JamObjectType, {description: 'Media Base Object Type', example: JamObjectType.track})
	objType!: JamObjectType;
	@ObjField({description: 'Duration of Track', min: 0, example: 12345})
	duration!: number;
	@ObjField(() => MediaTag, {nullable: true, description: 'Tag Meta Information'})
	tag?: MediaTag;
	@ObjField(() => MediaTagRaw, {nullable: true, description: 'Tag Raw Frames'})
	tagRaw?: MediaTagRaw;
	@ObjField(() => MediaInfo, {nullable: true, description: 'Media Information'})
	media?: MediaInfo;
	@ObjField({nullable: true, description: 'Artist Id', isID: true})
	artistID?: string;
	@ObjField({nullable: true, description: 'Album Artist Id', isID: true})
	albumArtistID?: string;
	@ObjField({nullable: true, description: 'Album Id', isID: true})
	albumID?: string;
	@ObjField({nullable: true, description: 'Series Id', isID: true})
	seriesID?: string;
	@ObjField(() => [GenreBase], {nullable: true, description: 'Genres'})
	genres?: Array<GenreBase>;
}
