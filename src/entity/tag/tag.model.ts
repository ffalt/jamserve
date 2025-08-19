import { Base } from '../base/base.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { JamObjectType } from '../../types/enums.js';
import { GenreBase } from '../genre/genre.model.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { MediaTagRawFrames } from './raw.model.js';

@ResultType({ description: 'Media Raw Tag' })
export class MediaTagRaw {
	@ObjectField({ description: 'Tag Version' })
	version!: number;

	@ObjectField(() => MediaTagRawFrames, { description: 'Tag Frames' })
	frames!: MediaTagRawFrames;
}

@ResultType({ description: 'Media Raw Tag' })
export class MediaIDTagRaw extends MediaTagRaw {
	@ObjectField({ description: 'Media File ID (Track/Episode)', isID: true })
	id!: string;
}

@ResultType({ description: 'Media Audio Info' })
export class MediaInfo {
	@ObjectField({ description: 'Bit Rate', example: 320_000 })
	bitRate?: number;

	@ObjectField({ nullable: true, description: 'Media Format', example: 'flac' })
	format?: string;

	@ObjectField({ nullable: true, description: 'Media Channels', example: 2 })
	channels?: number;

	@ObjectField({ nullable: true, description: 'Sample Rate (Hz)', example: 44_100 })
	sampleRate?: number;

	@ObjectField({ nullable: true, description: 'Bit Depth', example: 16 })
	bitDepth?: number;

	@ObjectField({ nullable: true, description: 'File Size', example: 31_321_516 })
	size?: number;
}

@ResultType({ description: 'Media Tag Data' })
export class MediaTag {
	@ObjectField({ nullable: true, description: 'Title', example: 'Goodbye Sober Day' })
	title?: string;

	@ObjectField({ nullable: true, description: 'Album Name', example: 'California' })
	album?: string;

	@ObjectField({ nullable: true, description: 'Artist Name', example: 'Mr. Bungle' })
	artist?: string;

	@ObjectField(() => [String], { nullable: true, description: 'Genres', example: examples.genres })
	genres?: Array<string>;

	@ObjectField({ nullable: true, description: 'Year', example: 1999 })
	year?: number;

	@ObjectField({ nullable: true, description: 'Track Nr', example: 10 })
	trackNr?: number;

	@ObjectField({ nullable: true, description: 'Disc Nr', example: 1 })
	disc?: number;

	@ObjectField({ nullable: true, description: 'Total Nr. of Disc', example: 1 })
	discTotal?: number;

	@ObjectField({ nullable: true, description: 'MusicBrainz Track Id', example: examples.mbTrackID })
	mbTrackID?: string;

	@ObjectField({ nullable: true, description: 'MusicBrainz Recording Id', example: examples.mbRecordingID })
	mbRecordingID?: string;

	@ObjectField({ nullable: true, description: 'MusicBrainz Release Track Id', example: examples.mbRecordingTrackID })
	mbReleaseTrackID?: string;

	@ObjectField({ nullable: true, description: 'MusicBrainz Release Group Id', example: examples.mbReleaseGroupID })
	mbReleaseGroupID?: string;

	@ObjectField({ nullable: true, description: 'MusicBrainz Release Id', example: examples.mbReleaseID })
	mbReleaseID?: string;

	@ObjectField({ nullable: true, description: 'MusicBrainz Artist Id', example: examples.mbArtistID })
	mbArtistID?: string;

	@ObjectField({ nullable: true, description: 'MusicBrainz Album Artist Id', example: examples.mbArtistID })
	mbAlbumArtistID?: string;
}

@ResultType({ description: 'Media Base' })
export class MediaBase extends Base {
	@ObjectField(() => JamObjectType, { description: 'Media Base Object Type', example: JamObjectType.track })
	objType!: JamObjectType;

	@ObjectField({ description: 'Duration of Track', min: 0, example: 12_345 })
	duration!: number;

	@ObjectField(() => MediaTag, { nullable: true, description: 'Tag Meta Information' })
	tag?: MediaTag;

	@ObjectField(() => MediaTagRaw, { nullable: true, description: 'Tag Raw Frames' })
	tagRaw?: MediaTagRaw;

	@ObjectField(() => MediaInfo, { nullable: true, description: 'Media Information' })
	media?: MediaInfo;

	@ObjectField({ nullable: true, description: 'Artist Id', isID: true })
	artistID?: string;

	@ObjectField({ nullable: true, description: 'Album Artist Id', isID: true })
	albumArtistID?: string;

	@ObjectField({ nullable: true, description: 'Album Id', isID: true })
	albumID?: string;

	@ObjectField({ nullable: true, description: 'Series Id', isID: true })
	seriesID?: string;

	@ObjectField(() => [GenreBase], { nullable: true, description: 'Genres' })
	genres?: Array<GenreBase>;
}
