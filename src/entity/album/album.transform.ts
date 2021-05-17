import {Inject, InRequestScope} from 'typescript-ioc';
import {BaseTransformService} from '../base/base.transform';
import {Orm} from '../../modules/engine/services/orm.service';
import {Album as ORMAlbum} from './album';
import {IncludesAlbumArgs} from './album.args';
import {User} from '../user/user';
import {DBObjectType} from '../../types/enums';
import {IndexResult, IndexResultGroup} from '../base/base';
import {Album, AlbumIndex} from './album.model';
import {MetaDataService} from '../metadata/metadata.service';
import {GenreTransformService} from '../genre/genre.transform';

@InRequestScope
export class AlbumTransformService extends BaseTransformService {
	@Inject
	public metaData!: MetaDataService;
	@Inject
	public Genre!: GenreTransformService;

	async albumBases(orm: Orm, list: Array<ORMAlbum>, albumArgs: IncludesAlbumArgs, user: User): Promise<Array<Album>> {
		return await Promise.all(list.map(t => this.albumBase(orm, t, albumArgs, user)));
	}

	async albumBase(orm: Orm, o: ORMAlbum, albumArgs: IncludesAlbumArgs, user: User): Promise<Album> {
		const artist = await o.artist.getOrFail();
		const series = await o.series.get();
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			genres: albumArgs.albumIncGenres ? await this.Genre.genreBases(orm, await o.genres.getItems(), {}, user) : undefined,
			year: o.year,
			mbArtistID: o.mbArtistID,
			mbReleaseID: o.mbReleaseID,
			albumType: o.albumType,
			duration: o.duration,
			artistID: artist.id,
			artistName: artist.name,
			series: series?.name,
			seriesID: series?.id,
			seriesNr: o.seriesNr,
			state: albumArgs.albumIncState ? await this.state(orm, o.id, DBObjectType.album, user.id) : undefined,
			trackCount: albumArgs.albumIncTrackCount ? await o.tracks.count() : undefined,
			trackIDs: albumArgs.albumIncTrackIDs ? await o.tracks.getIDs() : undefined,
			info: albumArgs.albumIncInfo ? await this.metaData.extInfo.byAlbum(orm, o) : undefined
		};
	}

	async albumIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMAlbum>>): Promise<AlbumIndex> {
		return this.index(result, async (item) => {
				const artist = await item.artist.get();
				return {
					id: item.id,
					name: item.name,
					artist: artist?.name || '[INVALID ARTIST]',
					artistID: artist?.id || (await item.artist.id()) || 'INVALID_ARTIST_ID',
					trackCount: await item.tracks.count()
				};
		});
	}

}
