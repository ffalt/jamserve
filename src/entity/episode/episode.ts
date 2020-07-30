import {Podcast, PodcastQL} from '../podcast/podcast';
import {Tag, TagQL} from '../tag/tag';
import {Bookmark, BookmarkQL} from '../bookmark/bookmark';
import {PodcastStatus} from '../../types/enums';
import {Field, Float, Int, ObjectType} from 'type-graphql';
import {Collection, Entity, ManyToOne, OneToMany, OneToOne, ORM_INT, ORM_TIMESTAMP, Property, QueryOrder, Reference} from '../../modules/orm';
import {Base, PaginatedResponse} from '../base/base';
import {State, StateQL} from '../state/state';
import {Waveform, WaveformQL} from '../waveform/waveform';
import {PlayQueueEntry} from '../playqueueentry/playqueue-entry';
import {PlaylistEntry} from '../playlistentry/playlist-entry';

@ObjectType()
export class EpisodeChapter {
	@Field(() => Float)
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
	@Field(() => Float, {nullable: true})
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
	@Property(() => String)
	name!: string;

	@Field(() => PodcastStatus)
	@Property(() => PodcastStatus)
	status!: PodcastStatus;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	fileSize?: number;

	@Property(() => ORM_TIMESTAMP, {nullable: true})
	statCreated?: number;

	@Property(() => ORM_TIMESTAMP, {nullable: true})
	statModified?: number;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	error?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	path?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	link?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	summary?: string;

	@Property(() => ORM_TIMESTAMP)
	date!: number;

	@Field(() => Float, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	duration?: number;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	guid?: string;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	author?: string;

	@Property(() => String, {nullable: true})
	chaptersJSON?: string;

	@Property(() => String, {nullable: true})
	enclosuresJSON?: string;

	@Field(() => TagQL, {nullable: true})
	@OneToOne<Tag>(() => Tag, tag => tag.episode, {owner: true, nullable: true})
	tag: Reference<Tag> = new Reference<Tag>(this);

	@Field(() => PodcastQL)
	@ManyToOne<Podcast>(() => Podcast, podcast => podcast.episodes)
	podcast: Reference<Podcast> = new Reference<Podcast>(this);

	@Field(() => [BookmarkQL])
	@OneToMany<Bookmark>(() => Bookmark, bookmark => bookmark.episode, {orderBy: {position: QueryOrder.ASC}})
	bookmarks: Collection<Bookmark> = new Collection<Bookmark>(this);

	@OneToMany<PlayQueueEntry>(() => PlayQueueEntry, playqueueEntry => playqueueEntry.episode)
	playqueueEntries: Collection<PlayQueueEntry> = new Collection<PlayQueueEntry>(this);

	@OneToMany<PlaylistEntry>(() => PlaylistEntry, playlistEntry => playlistEntry.episode)
	playlistEntries: Collection<PlaylistEntry> = new Collection<PlaylistEntry>(this);
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
