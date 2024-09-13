import {Ctx, FieldResolver, Resolver, Root as GQLRoot} from 'type-graphql';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {PlaylistEntry, PlaylistEntryQL} from './playlist-entry';
import {Track, TrackQL} from '../track/track';
import {Episode, EpisodeQL} from '../episode/episode';
import {Playlist, PlaylistQL} from '../playlist/playlist';

@Resolver(PlaylistEntryQL)
export class PlaylistEntryResolver {

	@FieldResolver(() => PlaylistQL)
	async playlist(@GQLRoot() playlistEntry: PlaylistEntry, @Ctx() _context: Context): Promise<Playlist> {
		return playlistEntry.playlist.getOrFail();
	}

	@FieldResolver(() => TrackQL, {nullable: true})
	async track(@GQLRoot() playlistEntry: PlaylistEntry, @Ctx() _context: Context): Promise<Track | undefined> {
		return playlistEntry.track.get();
	}

	@FieldResolver(() => EpisodeQL, {nullable: true})
	async episode(@GQLRoot() playlistEntry: PlaylistEntry, @Ctx() _context: Context): Promise<Episode | undefined> {
		return playlistEntry.episode.get();
	}
}
