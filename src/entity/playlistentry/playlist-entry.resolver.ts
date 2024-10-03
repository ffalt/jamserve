import { Ctx, FieldResolver, Resolver, Root as GQLRoot } from 'type-graphql';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { PlaylistEntry, PlaylistEntryQL } from './playlist-entry.js';
import { Track, TrackQL } from '../track/track.js';
import { Episode, EpisodeQL } from '../episode/episode.js';
import { Playlist, PlaylistQL } from '../playlist/playlist.js';

@Resolver(PlaylistEntryQL)
export class PlaylistEntryResolver {
	@FieldResolver(() => PlaylistQL)
	async playlist(@GQLRoot() playlistEntry: PlaylistEntry, @Ctx() _context: Context): Promise<Playlist> {
		return playlistEntry.playlist.getOrFail();
	}

	@FieldResolver(() => TrackQL, { nullable: true })
	async track(@GQLRoot() playlistEntry: PlaylistEntry, @Ctx() _context: Context): Promise<Track | undefined> {
		return playlistEntry.track.get();
	}

	@FieldResolver(() => EpisodeQL, { nullable: true })
	async episode(@GQLRoot() playlistEntry: PlaylistEntry, @Ctx() _context: Context): Promise<Episode | undefined> {
		return playlistEntry.episode.get();
	}
}
