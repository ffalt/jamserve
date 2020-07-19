import {AudioFormatType, TagFormatType} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {AudioScanResult} from '../../modules/audio/audio.module';
import {Entity, Enum, Property} from 'mikro-orm';
import {Base} from '../base/base';
import {TagChapter} from '../../modules/audio/audio.format';
import {GraphQLJSON} from 'graphql-type-json';
import {OrmStringListType} from '../../modules/engine/services/orm.types';

@ObjectType()
@Entity()
export class Tag extends Base implements AudioScanResult {
	@Field(() => TagFormatType)
	@Enum(() => TagFormatType)
	format!: TagFormatType;

	@Field(() => String, {nullable: true})
	@Property()
	album?: string;

	@Field(() => String, {nullable: true})
	@Property()
	albumSort?: string;

	@Field(() => String, {nullable: true})
	@Property()
	albumArtist?: string;

	@Field(() => String, {nullable: true})
	@Property()
	albumArtistSort?: string;

	@Field(() => String, {nullable: true})
	@Property()
	artist?: string;

	@Field(() => String, {nullable: true})
	@Property()
	artistSort?: string;

	@Field(() => [String], {nullable: true})
	@Property({type: OrmStringListType})
	genres?: Array<string>;

	@Field(() => Int, {nullable: true})
	@Property()
	disc?: number;

	@Field(() => Int, {nullable: true})
	@Property()
	discTotal?: number;

	@Field(() => String, {nullable: true})
	@Property()
	title?: string;

	@Field(() => String, {nullable: true})
	@Property()
	titleSort?: string;

	@Field(() => Int, {nullable: true})
	@Property()
	trackNr?: number;

	@Field(() => Int, {nullable: true})
	@Property()
	trackTotal?: number;

	@Field(() => Int, {nullable: true})
	@Property()
	year?: number;

	@Field(() => Int, {nullable: true})
	@Property()
	nrTagImages?: number;

	@Field(() => String, {nullable: true})
	@Property()
	mbTrackID?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbAlbumType?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbAlbumArtistID?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbArtistID?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbReleaseID?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbReleaseTrackID?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbReleaseGroupID?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbRecordingID?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbAlbumStatus?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mbReleaseCountry?: string;

	@Field(() => String, {nullable: true})
	@Property()
	series?: string;

	@Field(() => String, {nullable: true})
	@Property()
	seriesNr?: string;

	@Field(() => String, {nullable: true})
	@Property()
	lyrics?: string;

	@Field(() => [TagChapterQL], {nullable: true})
	@Property({type: 'json'})
	chapters?: Array<TagChapter>;

	@Field(() => Int, {nullable: true})
	@Property()
	mediaDuration?: number;

	@Field(() => Int, {nullable: true})
	@Property()
	mediaBitRate?: number;

	@Field(() => AudioFormatType, {nullable: true})
	@Enum(() => AudioFormatType)
	mediaFormat?: AudioFormatType;

	@Field(() => Int, {nullable: true})
	@Property()
	mediaSampleRate?: number;

	@Field(() => Int, {nullable: true})
	@Property()
	mediaChannels?: number;

	@Field(() => String, {nullable: true})
	@Property()
	mediaEncoded?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mediaMode?: string;

	@Field(() => String, {nullable: true})
	@Property()
	mediaVersion?: string;
}

@ObjectType()
export class TagChapterQL {
	@Field(() => Int)
	start!: number;
	@Field(() => Int)
	end!: number;
	@Field(() => String)
	title!: string;
}

@ObjectType()
export class TagQL extends Tag {
}

@ObjectType()
export class MediaTagRawQL {
	@Field(() => String)
	version!: string

	@Field(() => GraphQLJSON)
	frames!: any;
}
