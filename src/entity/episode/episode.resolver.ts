import { DBObjectType, PodcastStatus } from '../../types/enums.js';
import { Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { State, StateQL } from '../state/state.js';
import { Waveform, WaveformQL } from '../waveform/waveform.js';
import { Episode, EpisodeChapter, EpisodeChapterQL, EpisodeEnclosureQL, EpisodePageQL, EpisodeQL } from './episode.js';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { Tag, TagQL } from '../tag/tag.js';
import { Podcast, PodcastQL } from '../podcast/podcast.js';
import { Bookmark, BookmarkQL } from '../bookmark/bookmark.js';
import { EpisodesArgsQL } from './episode.args.js';

@Resolver(EpisodeQL)
export class EpisodeResolver {
	@Query(() => EpisodeQL, { description: 'Get a Episode by Id' })
	async episode(@Arg('id', () => ID!) id: string, @Ctx() { orm }: Context): Promise<Episode> {
		return await orm.Episode.oneOrFailByID(id);
	}

	@Query(() => EpisodePageQL, { description: 'Search Episodes' })
	async episodes(@Args() { page, filter, order, list, seed }: EpisodesArgsQL, @Ctx() { orm, user }: Context): Promise<EpisodePageQL> {
		if (list) {
			return await orm.Episode.findListFilter(list, seed, filter, order, page, user);
		}
		return await orm.Episode.searchFilter(filter, order, page, user);
	}

	@FieldResolver(() => TagQL, { nullable: true })
	async tag(@GQLRoot() episode: Episode): Promise<Tag | undefined> {
		return episode.tag.get();
	}

	@FieldResolver(() => PodcastQL)
	async podcast(@GQLRoot() episode: Episode): Promise<Podcast> {
		return episode.podcast.getOrFail();
	}

	@FieldResolver(() => [BookmarkQL])
	async bookmarks(@GQLRoot() episode: Episode): Promise<Array<Bookmark>> {
		return episode.bookmarks.getItems();
	}

	@FieldResolver(() => Int)
	async bookmarksCount(@GQLRoot() episode: Episode): Promise<number> {
		return episode.bookmarks.count();
	}

	@FieldResolver(() => WaveformQL)
	async waveform(@GQLRoot() episode: Episode): Promise<Waveform> {
		return { obj: episode, objType: DBObjectType.episode };
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() episode: Episode, @Ctx() { orm, user }: Context): Promise<State> {
		return await orm.State.findOrCreate(episode.id, DBObjectType.episode, user.id);
	}

	@FieldResolver(() => PodcastStatus)
	async status(@GQLRoot() episode: Episode, @Ctx() { engine }: Context): Promise<PodcastStatus> {
		return engine.episode.isDownloading(episode.id) ? PodcastStatus.downloading : episode.status;
	}

	@FieldResolver(() => Date)
	fileCreated(@GQLRoot() episode: Episode): Date | undefined {
		return episode.statCreated;
	}

	@FieldResolver(() => Date)
	fileModified(@GQLRoot() episode: Episode): Date | undefined {
		return episode.statModified;
	}

	@FieldResolver(() => Date)
	date(@GQLRoot() episode: Episode): Date {
		return new Date(episode.date);
	}

	@FieldResolver(() => [EpisodeChapterQL])
	chapters(@GQLRoot() episode: Episode): Array<EpisodeChapter> | undefined {
		return episode.chaptersJSON ? JSON.parse(episode.chaptersJSON) : undefined;
	}

	@FieldResolver(() => [EpisodeEnclosureQL])
	enclosures(@GQLRoot() episode: Episode): Array<EpisodeChapter> | undefined {
		return episode.enclosuresJSON ? JSON.parse(episode.enclosuresJSON) : undefined;
	}
}
