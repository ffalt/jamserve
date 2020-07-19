import {Podcast, PodcastQL} from '../podcast/podcast';
import {Tag, TagQL} from '../tag/tag';
import {Bookmark, BookmarkQL} from '../bookmark/bookmark';
import {PodcastStatus} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, OneToOne, Property, QueryOrder} from 'mikro-orm';
import {Base, PaginatedResponse} from '../base/base';
import {State, StateQL} from '../state/state';
import {Waveform, WaveformQL} from '../waveform/waveform';

@ObjectType()
export class EpisodeChapter {
	@Field(() => Int)
	start!: number;
	@Field(() => String)
	title!: string;
}

@ObjectType()
export class EpisodeEnclosure {
	@Field(() => String)
	url!: string;
	@Field(() => String, {nullable: true})
	type?: string;
	@Field(() => Int, {nullable: true})
	length?: number;
}

@ObjectType()
export class EpisodeChapterQL extends EpisodeChapter {
}

@ObjectType()
export class EpisodeEnclosureQL extends EpisodeEnclosure {
}

@ObjectType()
@Entity()
export class Episode extends Base {
	@Field(() => String)
	@Property()
	name!: string;

	@Enum(() => PodcastStatus)
	@Property()
	status!: PodcastStatus;

	@Field(() => Int, {nullable: true})
	@Property()
	fileSize?: number;

	@Property()
	statCreated?: number;

	@Property()
	statModified?: number;

	@Field(() => String, {nullable: true})
	@Property()
	error?: string;

	@Field(() => String, {nullable: true})
	@Property()
	path?: string;

	@Field(() => String, {nullable: true})
	@Property()
	link?: string;

	@Field(() => String, {nullable: true})
	@Property()
	summary?: string;

	@Property()
	date!: number;

	@Field(() => Int, {nullable: true})
	@Property({nullable: true})
	duration?: number;

	@Field(() => String, {nullable: true})
	@Property({nullable: true})
	guid?: string;

	@Field(() => String, {nullable: true})
	@Property({nullable: true})
	author?: string;

	@Property({nullable: true})
	chaptersJSON?: string;

	@Property({nullable: true})
	enclosuresJSON?: string;

	@Field(() => TagQL, {nullable: true})
	@OneToOne({entity: () => Tag, nullable: true})
	tag?: Tag;

	@Field(() => PodcastQL)
	@ManyToOne(() => Podcast)
	podcast!: Podcast;

	@Field(() => [BookmarkQL])
	@OneToMany({entity: () => Bookmark, mappedBy: bookmark => bookmark.episode, cascade: [Cascade.REMOVE], orderBy: {position: QueryOrder.ASC}})
	bookmarks: Collection<Bookmark> = new Collection<Bookmark>(this);
}


@ObjectType()
export class EpisodeQL extends Episode {
	@Field(() => Int)
	bookmarksCount!: number;

	@Field(() => StateQL)
	state!: State

	@Field(() => Date, {nullable: true})
	fileCreated?: Date;

	@Field(() => Date, {nullable: true})
	fileModified?: Date;

	@Field(() => Date)
	date!: number;

	@Field(() => [EpisodeChapterQL!], {nullable: true})
	chapters?: Array<EpisodeChapter>;

	@Field(() => [EpisodeEnclosureQL!], {nullable: true})
	enclosures?: Array<EpisodeEnclosure>;

	@Field(() => WaveformQL)
	waveform!: Waveform;
}

@ObjectType()
export class EpisodePageQL extends PaginatedResponse(Episode, EpisodeQL) {
}
