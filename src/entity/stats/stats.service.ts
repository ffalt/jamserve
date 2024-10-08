import { Stats, UserDetailStats, UserStats } from './stats.model.js';
import { InRequestScope } from 'typescript-ioc';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { AlbumType, ListType } from '../../types/enums.js';
import { MUSICBRAINZ_VARIOUS_ARTISTS_ID } from '../../types/consts.js';
import { User } from '../user/user.js';

@InRequestScope
export class StatsService {
	private stats: Array<Stats> = [];

	async refresh(): Promise<void> {
		this.stats = [];
	}

	async getStats(orm: Orm, rootID?: string): Promise<Stats> {
		let stat = this.stats.find(s => s.rootID === rootID);
		if (!stat) {
			let rootIDs: Array<string> | undefined;
			if (rootID) {
				rootIDs = [rootID];
			}
			stat = {
				rootID,
				album: await orm.Album.countFilter({ rootIDs }),
				series: await orm.Series.countFilter({ rootIDs }),
				artist: await orm.Artist.countFilter({ rootIDs }),
				folder: await orm.Folder.countFilter({ rootIDs }),
				track: await orm.Track.countFilter({ rootIDs }),
				albumTypes: {
					album: await orm.Album.countFilter({ rootIDs, albumTypes: [AlbumType.album] }),
					compilation: await orm.Album.countFilter({ rootIDs, albumTypes: [AlbumType.compilation], mbArtistIDs: [MUSICBRAINZ_VARIOUS_ARTISTS_ID] }),
					artistCompilation: await orm.Album.countFilter({ rootIDs, albumTypes: [AlbumType.compilation], notMbArtistID: MUSICBRAINZ_VARIOUS_ARTISTS_ID }),
					audiobook: await orm.Album.countFilter({ rootIDs, albumTypes: [AlbumType.audiobook] }),
					series: await orm.Album.countFilter({ rootIDs, albumTypes: [AlbumType.series] }),
					soundtrack: await orm.Album.countFilter({ rootIDs, albumTypes: [AlbumType.soundtrack] }),
					bootleg: await orm.Album.countFilter({ rootIDs, albumTypes: [AlbumType.bootleg] }),
					live: await orm.Album.countFilter({ rootIDs, albumTypes: [AlbumType.live] }),
					ep: await orm.Album.countFilter({ rootIDs, albumTypes: [AlbumType.ep] }),
					unknown: await orm.Album.countFilter({ rootIDs, albumTypes: [AlbumType.unknown] }),
					single: await orm.Album.countFilter({ rootIDs, albumTypes: [AlbumType.single] })
				},
				artistTypes: {
					album: await orm.Artist.countFilter({ rootIDs, albumTypes: [AlbumType.album] }),
					compilation: await orm.Artist.countFilter({ rootIDs, albumTypes: [AlbumType.compilation], mbArtistIDs: [MUSICBRAINZ_VARIOUS_ARTISTS_ID] }),
					artistCompilation: await orm.Artist.countFilter({ rootIDs, albumTypes: [AlbumType.compilation], notMbArtistID: MUSICBRAINZ_VARIOUS_ARTISTS_ID }),
					audiobook: await orm.Artist.countFilter({ rootIDs, albumTypes: [AlbumType.audiobook] }),
					series: await orm.Artist.countFilter({ rootIDs, albumTypes: [AlbumType.series] }),
					soundtrack: await orm.Artist.countFilter({ rootIDs, albumTypes: [AlbumType.soundtrack] }),
					bootleg: await orm.Artist.countFilter({ rootIDs, albumTypes: [AlbumType.bootleg] }),
					live: await orm.Artist.countFilter({ rootIDs, albumTypes: [AlbumType.live] }),
					ep: await orm.Artist.countFilter({ rootIDs, albumTypes: [AlbumType.ep] }),
					unknown: await orm.Artist.countFilter({ rootIDs, albumTypes: [AlbumType.unknown] }),
					single: await orm.Artist.countFilter({ rootIDs, albumTypes: [AlbumType.single] })
				}
			};
			this.stats.push(stat);
		}
		return stat;
	}

	async getUserStatsDetails(orm: Orm, user: User, list: ListType): Promise<UserDetailStats> {
		const result: UserDetailStats = {
			album: await orm.Album.countList(list, {}, user.id),
			artist: await orm.Artist.countList(list, {}, user.id),
			folder: await orm.Folder.countList(list, {}, user.id),
			track: await orm.Track.countList(list, {}, user.id),
			series: await orm.Series.countList(list, {}, user.id),
			albumTypes: {
				album: await orm.Album.countListFilter(list, { albumTypes: [AlbumType.album] }, user),
				compilation: await orm.Album.countListFilter(list, { albumTypes: [AlbumType.compilation], mbArtistIDs: [MUSICBRAINZ_VARIOUS_ARTISTS_ID] }, user),
				artistCompilation: await orm.Album.countListFilter(list, { albumTypes: [AlbumType.compilation], notMbArtistID: MUSICBRAINZ_VARIOUS_ARTISTS_ID }, user),
				audiobook: await orm.Album.countListFilter(list, { albumTypes: [AlbumType.audiobook] }, user),
				series: await orm.Album.countListFilter(list, { albumTypes: [AlbumType.series] }, user),
				soundtrack: await orm.Album.countListFilter(list, { albumTypes: [AlbumType.soundtrack] }, user),
				bootleg: await orm.Album.countListFilter(list, { albumTypes: [AlbumType.bootleg] }, user),
				live: await orm.Album.countListFilter(list, { albumTypes: [AlbumType.live] }, user),
				ep: await orm.Album.countListFilter(list, { albumTypes: [AlbumType.ep] }, user),
				unknown: await orm.Album.countListFilter(list, { albumTypes: [AlbumType.unknown] }, user),
				single: await orm.Album.countListFilter(list, { albumTypes: [AlbumType.single] }, user)
			},
			artistTypes: {
				album: await orm.Artist.countListFilter(list, { albumTypes: [AlbumType.album] }, user),
				compilation: await orm.Artist.countListFilter(list, { albumTypes: [AlbumType.compilation], mbArtistIDs: [MUSICBRAINZ_VARIOUS_ARTISTS_ID] }, user),
				artistCompilation: await orm.Artist.countListFilter(list, { albumTypes: [AlbumType.compilation], notMbArtistID: MUSICBRAINZ_VARIOUS_ARTISTS_ID }, user),
				audiobook: await orm.Artist.countListFilter(list, { albumTypes: [AlbumType.audiobook] }, user),
				series: await orm.Artist.countListFilter(list, { albumTypes: [AlbumType.series] }, user),
				soundtrack: await orm.Artist.countListFilter(list, { albumTypes: [AlbumType.soundtrack] }, user),
				bootleg: await orm.Artist.countListFilter(list, { albumTypes: [AlbumType.bootleg] }, user),
				live: await orm.Artist.countListFilter(list, { albumTypes: [AlbumType.live] }, user),
				ep: await orm.Artist.countListFilter(list, { albumTypes: [AlbumType.ep] }, user),
				unknown: await orm.Artist.countListFilter(list, { albumTypes: [AlbumType.unknown] }, user),
				single: await orm.Artist.countListFilter(list, { albumTypes: [AlbumType.single] }, user)
			}

		};
		return result;
	}

	async getUserStats(orm: Orm, user: User): Promise<UserStats> {
		const result: UserStats = {
			bookmark: await user.bookmarks.count(),
			playlist: await user.playlists.count(),
			favorite: await this.getUserStatsDetails(orm, user, ListType.faved),
			played: await this.getUserStatsDetails(orm, user, ListType.recent)
		};
		return result;
	}
}
