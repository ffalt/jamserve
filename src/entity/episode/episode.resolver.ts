import {DBObjectType, PodcastStatus} from '../../types/enums';
import {Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {State, StateQL} from '../state/state';
import {Waveform, WaveformQL} from '../waveform/waveform';
import {Episode, EpisodeChapter, EpisodeChapterQL, EpisodeEnclosureQL, EpisodePageQL, EpisodeQL} from './episode';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {Tag, TagQL} from '../tag/tag';
import {Podcast, PodcastQL} from '../podcast/podcast';
import {Bookmark, BookmarkQL} from '../bookmark/bookmark';
import {EpisodesArgs} from './episode.args';

@Resolver(EpisodeQL)
export class EpisodeResolver {
	@Query(() => EpisodeQL, {description: 'Get a Episode by Id'})
	async episode(@Arg('id', () => ID!) id: string, @Ctx() {orm}: Context): Promise<Episode> {
		return await orm.Episode.oneOrFail(id)
	}

	@Query(() => EpisodePageQL, {description: 'Search Episodes'})
	async episodes(@Args() {page, filter, order, list}: EpisodesArgs, @Ctx() {orm, user}: Context): Promise<EpisodePageQL> {
		if (list) {
			return await orm.Episode.findListFilter(list, filter, order, page, user);
		}
		return await orm.Episode.searchFilter(filter, order, page, user);
	}

	@FieldResolver(() => TagQL, {nullable: true})
	async tag(@GQLRoot() episode: Episode, @Ctx() {orm}: Context): Promise<Tag | undefined> {
		await orm.Episode.populate(episode, 'tag');
		return episode.tag;
	}

	@FieldResolver(() => PodcastQL)
	async podcast(@GQLRoot() episode: Episode, @Ctx() {orm}: Context): Promise<Podcast> {
		await orm.Episode.populate(episode, 'podcast');
		return episode.podcast;
	}

	@FieldResolver(() => [BookmarkQL])
	async bookmarks(@GQLRoot() episode: Episode, @Ctx() {orm}: Context): Promise<Array<Bookmark>> {
		await orm.Episode.populate(episode, 'bookmarks');
		return episode.bookmarks.getItems();
	}

	@FieldResolver(() => Int)
	async bookmarksCount(@GQLRoot() episode: Episode, @Ctx() {orm}: Context): Promise<number> {
		await orm.Episode.populate(episode, 'bookmarks');
		return episode.bookmarks.length;
	}

	@FieldResolver(() => WaveformQL)
	async waveform(@GQLRoot() episode: Episode): Promise<Waveform> {
		return {obj: episode, objType: DBObjectType.episode};
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() episode: Episode, @Ctx() {orm, user}: Context): Promise<State> {
		return await orm.State.findOrCreate(episode.id, DBObjectType.episode, user.id);
	}

	@FieldResolver(() => PodcastStatus)
	async status(@GQLRoot() episode: Episode, @Ctx() {engine}: Context): Promise<PodcastStatus> {
		return engine.episodeService.isDownloading(episode.id) ? PodcastStatus.downloading : episode.status;
	}

	@FieldResolver(() => Date)
	fileCreated(@GQLRoot() episode: Episode): Date | undefined {
		return episode.statCreated ? new Date(episode.statCreated) : undefined;
	}

	@FieldResolver(() => Date)
	fileModified(@GQLRoot() episode: Episode): Date | undefined {
		return episode.statModified ? new Date(episode.statModified) : undefined;
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
