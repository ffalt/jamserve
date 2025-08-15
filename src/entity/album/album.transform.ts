import { Inject, InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Album as ORMAlbum } from './album.js';
import { IncludesAlbumParameters } from './album.parameters.js';
import { User } from '../user/user.js';
import { DBObjectType } from '../../types/enums.js';
import { IndexResult, IndexResultGroup } from '../base/base.js';
import { Album, AlbumIndex } from './album.model.js';
import { MetaDataService } from '../metadata/metadata.service.js';
import { GenreTransformService } from '../genre/genre.transform.js';

@InRequestScope
export class AlbumTransformService extends BaseTransformService {
	@Inject
	public metaData!: MetaDataService;

	@Inject
	public Genre!: GenreTransformService;

	async albumBases(orm: Orm, list: Array<ORMAlbum>, albumParameters: IncludesAlbumParameters, user: User): Promise<Array<Album>> {
		return await Promise.all(list.map(t => this.albumBase(orm, t, albumParameters, user)));
	}

	async albumBase(orm: Orm, o: ORMAlbum, albumParameters: IncludesAlbumParameters, user: User): Promise<Album> {
		const artist = await o.artist.getOrFail();
		const series = await o.series.get();
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			genres: albumParameters.albumIncGenres ? await this.Genre.genreBases(orm, await o.genres.getItems(), {}, user) : undefined,
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
			state: albumParameters.albumIncState ? await this.state(orm, o.id, DBObjectType.album, user.id) : undefined,
			trackCount: albumParameters.albumIncTrackCount ? await o.tracks.count() : undefined,
			trackIDs: albumParameters.albumIncTrackIDs ? await o.tracks.getIDs() : undefined,
			info: albumParameters.albumIncInfo ? await this.metaData.extInfo.byAlbum(orm, o) : undefined
		};
	}

	async albumIndex(_orm: Orm, result: IndexResult<IndexResultGroup<ORMAlbum>>): Promise<AlbumIndex> {
		return this.index(result, async item => {
			const artist = await item.artist.get();
			return {
				id: item.id,
				name: item.name,
				artist: artist?.name ?? '[INVALID ARTIST]',
				artistID: artist?.id ?? item.artist.id() ?? 'INVALID_ARTIST_ID',
				trackCount: await item.tracks.count()
			};
		});
	}
}
