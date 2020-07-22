import {AudioFormatType, TagFormatType} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Entity, OneToOne, ORM_INT, Property, Reference} from '../../modules/orm';
import {Base} from '../base/base';
import {GraphQLJSON} from 'graphql-type-json';
import {Episode} from '../episode/episode';
import {Track} from '../track/track';

@ObjectType()
@Entity()
export class Tag extends Base {
	@Field(() => TagFormatType)
	@Property(() => TagFormatType)
	format!: TagFormatType;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	album?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	albumSort?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	albumArtist?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	albumArtistSort?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	artist?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	artistSort?: string;

	@Field(() => [String], {nullable: true})
	@Property(() => [String], {nullable: true})
	genres?: Array<string>;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	disc?: number;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	discTotal?: number;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	title?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	titleSort?: string;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	trackNr?: number;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	trackTotal?: number;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	year?: number;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	nrTagImages?: number;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbTrackID?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbAlbumType?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbAlbumArtistID?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbArtistID?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbReleaseID?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbReleaseTrackID?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbReleaseGroupID?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbRecordingID?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbAlbumStatus?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mbReleaseCountry?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	series?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	seriesNr?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	lyrics?: string;

	@Field(() => [TagChapterQL], {nullable: true})
	@Property(() => String, {nullable: true})
	chapters?: string;//Array<TagChapter>;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	mediaDuration?: number;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	mediaBitRate?: number;

	@Field(() => AudioFormatType, {nullable: true})
	@Property(() => AudioFormatType, {nullable: true})
	mediaFormat?: AudioFormatType;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	mediaSampleRate?: number;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	mediaChannels?: number;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mediaEncoded?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mediaMode?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	mediaVersion?: string;

	@OneToOne<Episode>(() => Episode, episode => episode.tag, {nullable: true})
	episode = new Reference<Episode>(this);

	@OneToOne<Track>(() => Track, track => track.tag, {nullable: true})
	track = new Reference<Track>(this);

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
