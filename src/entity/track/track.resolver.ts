import { Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { State, StateQL } from '../state/state.js';
import { DBObjectType } from '../../types/enums.js';
import { Waveform, WaveformQL } from '../waveform/waveform.js';
import { Track, TrackLyricsQL, TrackPageQL, TrackQL } from './track.js';
import { Folder, FolderQL } from '../folder/folder.js';
import { Album, AlbumQL } from '../album/album.js';
import { Artist, ArtistQL } from '../artist/artist.js';
import { Root, RootQL } from '../root/root.js';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { TrackLyrics } from './track.model.js';
import { MediaTagRawQL, Tag, TagQL } from '../tag/tag.js';
import { MediaTagRaw } from '../tag/tag.model.js';
import { Series, SeriesQL } from '../series/series.js';
import { Bookmark, BookmarkQL } from '../bookmark/bookmark.js';
import { TracksParametersQL } from './track.parameters.js';
import { Genre, GenreQL } from '../genre/genre.js';

@Resolver(TrackQL)
export class TrackResolver {
	@Query(() => TrackQL)
	async track(@Arg('id', () => ID!) id: string, @Ctx() { orm }: Context): Promise<Track> {
		return await orm.Track.oneOrFailByID(id);
	}

	@Query(() => TrackPageQL)
	async tracks(@Args() { page, filter, order, list, seed }: TracksParametersQL, @Ctx() { orm, user }: Context): Promise<TrackPageQL> {
		if (list) {
			return await orm.Track.findListFilter(list, seed, filter, order, page, user);
		}
		return await orm.Track.searchFilter(filter, order, page, user);
	}

	@FieldResolver(() => [BookmarkQL])
	async bookmarks(@GQLRoot() track: Track): Promise<Array<Bookmark>> {
		return track.bookmarks.getItems();
	}

	@FieldResolver(() => [GenreQL])
	async genres(@GQLRoot() track: Track): Promise<Array<Genre>> {
		return track.genres.getItems();
	}

	@FieldResolver(() => Int)
	async bookmarksCount(@GQLRoot() track: Track): Promise<number> {
		return track.bookmarks.count();
	}

	@FieldResolver(() => Date)
	fileCreated(@GQLRoot() track: Track): Date {
		return track.statCreated;
	}

	@FieldResolver(() => Date)
	fileModified(@GQLRoot() track: Track): Date {
		return track.statModified;
	}

	@FieldResolver(() => FolderQL)
	async folder(@GQLRoot() track: Track): Promise<Folder> {
		return track.folder.getOrFail();
	}

	@FieldResolver(() => TagQL, { nullable: true })
	async tag(@GQLRoot() track: Track): Promise<Tag | undefined> {
		return track.tag.get();
	}

	@FieldResolver(() => AlbumQL, { nullable: true })
	async album(@GQLRoot() track: Track): Promise<Album | undefined> {
		return track.album.get();
	}

	@FieldResolver(() => SeriesQL, { nullable: true })
	async series(@GQLRoot() track: Track): Promise<Series | undefined> {
		return track.series.get();
	}

	@FieldResolver(() => ArtistQL, { nullable: true })
	async albumArtist(@GQLRoot() track: Track): Promise<Artist | undefined> {
		return track.albumArtist.get();
	}

	@FieldResolver(() => ArtistQL, { nullable: true })
	async artist(@GQLRoot() track: Track): Promise<Artist | undefined> {
		return track.artist.get();
	}

	@FieldResolver(() => RootQL)
	async root(@GQLRoot() track: Track): Promise<Root> {
		return track.root.getOrFail();
	}

	@FieldResolver(() => WaveformQL)
	async waveform(@GQLRoot() track: Track): Promise<Waveform> {
		return { obj: track, objType: DBObjectType.track };
	}

	@FieldResolver(() => TrackLyricsQL)
	async lyrics(@GQLRoot() track: Track, @Ctx() { engine, orm }: Context): Promise<TrackLyrics> {
		return await engine.metadata.lyricsByTrack(orm, track);
	}

	@FieldResolver(() => MediaTagRawQL)
	async rawTag(@GQLRoot() track: Track, @Ctx() { engine }: Context): Promise<MediaTagRaw> {
		return (await engine.track.getRawTag(track)) ?? { version: 0, frames: {} };
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() track: Track, @Ctx() { orm, user }: Context): Promise<State> {
		return await orm.State.findOrCreate(track.id, DBObjectType.track, user.id);
	}
}
