import {Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {State, StateQL} from '../state/state';
import {DBObjectType} from '../../types/enums';
import {Waveform, WaveformQL} from '../waveform/waveform';
import {Track, TrackLyricsQL, TrackPageQL, TrackQL} from './track';
import {Folder, FolderQL} from '../folder/folder';
import {Album, AlbumQL} from '../album/album';
import {Artist, ArtistQL} from '../artist/artist';
import {Root, RootQL} from '../root/root';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {TrackLyrics} from './track.model';
import {MediaTagRawQL, Tag, TagQL} from '../tag/tag';
import {MediaTagRaw} from '../tag/tag.model';
import path from 'path';
import {Series, SeriesQL} from '../series/series';
import {Bookmark, BookmarkQL} from '../bookmark/bookmark';
import {TracksArgs} from './track.args';

@Resolver(TrackQL)
export class TrackResolver {

	@Query(() => TrackQL)
	async track(@Arg('id', () => ID!) id: string, @Ctx() {orm}: Context): Promise<Track> {
		return await orm.Track.oneOrFail(id)
	}

	@Query(() => TrackPageQL)
	async tracks(@Args() {page, filter, order, list}: TracksArgs, @Ctx() {orm, user}: Context): Promise<TrackPageQL> {
		if (list) {
			return await orm.Track.findListFilter(list, filter, order, page, user);
		}
		return await orm.Track.searchFilter(filter, order, page, user);
	}

	@FieldResolver(() => [BookmarkQL])
	async bookmarks(@GQLRoot() track: Track, @Ctx() {orm}: Context): Promise<Array<Bookmark>> {
		await orm.Track.populate(track, 'bookmarks');
		return track.bookmarks.getItems();
	}

	@FieldResolver(() => Int)
	async bookmarksCount(@GQLRoot() track: Track, @Ctx() {orm}: Context): Promise<number> {
		await orm.Track.populate(track, 'bookmarks');
		return track.bookmarks.length;
	}

	@FieldResolver(() => Date)
	fileCreated(@GQLRoot() track: Track): Date {
		return new Date(track.statCreated);
	}

	@FieldResolver(() => Date)
	fileModified(@GQLRoot() track: Track): Date {
		return new Date(track.statModified);
	}

	@FieldResolver(() => FolderQL)
	async folder(@GQLRoot() track: Track, @Ctx() {orm}: Context): Promise<Folder> {
		await orm.Track.populate(track, 'folder');
		return track.folder;
	}

	@FieldResolver(() => TagQL, {nullable: true})
	async tag(@GQLRoot() track: Track, @Ctx() {orm}: Context): Promise<Tag | undefined> {
		await orm.Track.populate(track, 'tag');
		return track.tag;
	}

	@FieldResolver(() => AlbumQL, {nullable: true})
	async album(@GQLRoot() track: Track, @Ctx() {orm}: Context): Promise<Album | undefined> {
		await orm.Track.populate(track, 'album');
		return track.album;
	}

	@FieldResolver(() => SeriesQL, {nullable: true})
	async series(@GQLRoot() track: Track, @Ctx() {orm}: Context): Promise<Series | undefined> {
		await orm.Track.populate(track, 'series');
		return track.series;
	}

	@FieldResolver(() => ArtistQL, {nullable: true})
	async albumArtist(@GQLRoot() track: Track, @Ctx() {orm}: Context): Promise<Artist | undefined> {
		await orm.Track.populate(track, 'albumArtist');
		return track.albumArtist;
	}

	@FieldResolver(() => ArtistQL, {nullable: true})
	async artist(@GQLRoot() track: Track, @Ctx() {orm}: Context): Promise<Artist | undefined> {
		await orm.Track.populate(track, 'artist');
		return track.artist;
	}

	@FieldResolver(() => RootQL)
	async root(@GQLRoot() track: Track, @Ctx() {orm}: Context): Promise<Root> {
		await orm.Track.populate(track, 'root');
		return track.root;
	}

	@FieldResolver(() => WaveformQL)
	async waveform(@GQLRoot() track: Track): Promise<Waveform> {
		return {obj: track, objType: DBObjectType.track};
	}

	@FieldResolver(() => TrackLyricsQL)
	async lyrics(@GQLRoot() track: Track, @Ctx() {engine}: Context): Promise<TrackLyrics> {
		return engine.metadataService.lyricsByTrack(track);
	}

	@FieldResolver(() => MediaTagRawQL)
	async rawTag(@GQLRoot() track: Track, @Ctx() {engine}: Context): Promise<MediaTagRaw> {
		return (await engine.audioModule.readRawTag(path.join(track.path, track.fileName))) || {};
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() track: Track, @Ctx() {orm, user}: Context): Promise<State> {
		return await orm.State.findOrCreate(track.id, DBObjectType.track, user.id);
	}
}
