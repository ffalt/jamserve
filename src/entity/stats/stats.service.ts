import {Stats} from './stats.model';
import {InRequestScope} from 'typescript-ioc';
import {Orm} from '../../modules/engine/services/orm.service';
import {AlbumType} from '../../types/enums';
import {MUSICBRAINZ_VARIOUS_ARTISTS_ID} from '../../types/consts';
import {Artist} from '../artist/artist';
import {Op, QHelper, WhereOptions} from '../../modules/orm';

@InRequestScope
export class StatsService {
	private stats: Array<Stats> = [];

	async refresh(): Promise<void> {
		this.stats = [];
	}

	async getStats(orm: Orm, rootID?: string): Promise<Stats> {
		let stat = this.stats.find(s => s.rootID === rootID);
		if (!stat) {
			const inAlbumTypes = (albumType: AlbumType): WhereOptions<Artist> => {
				return QHelper.inStringArray('albumTypes', [albumType])[0];
			};
			let rootIDs: Array<string> | undefined;
			if (rootID) {
				rootIDs = [rootID];
			}
			stat = {
				rootID,
				album: await orm.Album.countFilter({rootIDs}),
				series: await orm.Series.countFilter({rootIDs}),
				artist: await orm.Artist.countFilter({rootIDs}),
				folder: await orm.Folder.countFilter({rootIDs}),
				track: await orm.Track.countFilter({rootIDs}),
				albumTypes: {
					album: await orm.Album.countFilter({rootIDs, albumTypes: [AlbumType.album]}),
					compilation: await orm.Album.countFilter({rootIDs, albumTypes: [AlbumType.compilation], mbArtistIDs: [MUSICBRAINZ_VARIOUS_ARTISTS_ID]}),
					artistCompilation: await orm.Album.count({
						include: QHelper.includeQueries([{roots: [{id: QHelper.inOrEqual(rootIDs)}]}]),
						where: {albumType: AlbumType.compilation, mbArtistID: {[Op.ne]: MUSICBRAINZ_VARIOUS_ARTISTS_ID}}
					}),
					audiobook: await orm.Album.countFilter({rootIDs, albumTypes: [AlbumType.audiobook]}),
					series: await orm.Album.countFilter({rootIDs, albumTypes: [AlbumType.series]}),
					soundtrack: await orm.Album.countFilter({rootIDs, albumTypes: [AlbumType.soundtrack]}),
					bootleg: await orm.Album.countFilter({rootIDs, albumTypes: [AlbumType.bootleg]}),
					live: await orm.Album.countFilter({rootIDs, albumTypes: [AlbumType.live]}),
					ep: await orm.Album.countFilter({rootIDs, albumTypes: [AlbumType.ep]}),
					unknown: await orm.Album.countFilter({rootIDs, albumTypes: [AlbumType.unknown]}),
					single: await orm.Album.countFilter({rootIDs, albumTypes: [AlbumType.single]}),
				},
				artistTypes: {
					album: await orm.Artist.countFilter({rootIDs, albumTypes: [AlbumType.album]}),
					compilation: await orm.Artist.countFilter({rootIDs, albumTypes: [AlbumType.compilation], mbArtistIDs: [MUSICBRAINZ_VARIOUS_ARTISTS_ID]}),
					artistCompilation: await orm.Artist.count({
						include: QHelper.includeQueries([{roots: [{id: QHelper.inOrEqual(rootIDs)}]}]),
						where: {...inAlbumTypes(AlbumType.compilation), mbArtistID: {[Op.ne]: MUSICBRAINZ_VARIOUS_ARTISTS_ID}}
					}),
					audiobook: await orm.Artist.countFilter({rootIDs, albumTypes: [AlbumType.audiobook]}),
					series: await orm.Artist.countFilter({rootIDs, albumTypes: [AlbumType.series]}),
					soundtrack: await orm.Artist.countFilter({rootIDs, albumTypes: [AlbumType.soundtrack]}),
					bootleg: await orm.Artist.countFilter({rootIDs, albumTypes: [AlbumType.bootleg]}),
					live: await orm.Artist.countFilter({rootIDs, albumTypes: [AlbumType.live]}),
					ep: await orm.Artist.countFilter({rootIDs, albumTypes: [AlbumType.ep]}),
					unknown: await orm.Artist.countFilter({rootIDs, albumTypes: [AlbumType.unknown]}),
					single: await orm.Artist.countFilter({rootIDs, albumTypes: [AlbumType.single]}),
				}
			};
			this.stats.push(stat);
		}
		return stat;
	}

}
