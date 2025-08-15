import { Inject, InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Artist as ORMArtist } from './artist.js';
import { IncludesArtistParameters } from './artist.parameters.js';
import { User } from '../user/user.js';
import { ArtistBase, ArtistIndex } from './artist.model.js';
import { DBObjectType } from '../../types/enums.js';
import { IndexResult, IndexResultGroup } from '../base/base.js';
import { MetaDataService } from '../metadata/metadata.service.js';
import { GenreTransformService } from '../genre/genre.transform.js';

@InRequestScope
export class ArtistTransformService extends BaseTransformService {
	@Inject
	public metaData!: MetaDataService;

	@Inject
	public Genre!: GenreTransformService;

	async artistBases(orm: Orm, list: Array<ORMArtist>, artistParameters: IncludesArtistParameters, user: User): Promise<Array<ArtistBase>> {
		return await Promise.all(list.map(t => this.artistBase(orm, t, artistParameters, user)));
	}

	async artistBase(orm: Orm, o: ORMArtist, artistParameters: IncludesArtistParameters, user: User): Promise<ArtistBase> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			albumCount: artistParameters.artistIncAlbumCount ? await o.albums.count() : undefined,
			trackCount: artistParameters.artistIncTrackCount ? await o.tracks.count() : undefined,
			seriesCount: artistParameters.artistIncSeriesCount ? await o.series.count() : undefined,
			mbArtistID: o.mbArtistID,
			genres: artistParameters.artistIncGenres ? await this.Genre.genreBases(orm, await o.genres.getItems(), {}, user) : undefined,
			albumTypes: o.albumTypes,
			state: artistParameters.artistIncState ? await this.state(orm, o.id, DBObjectType.artist, user.id) : undefined,
			trackIDs: artistParameters.artistIncTrackIDs ? await o.tracks.getIDs() : undefined,
			albumIDs: artistParameters.artistIncAlbumIDs ? await o.albums.getIDs() : undefined,
			seriesIDs: artistParameters.artistIncSeriesIDs ? await o.series.getIDs() : undefined,
			info: artistParameters.artistIncInfo ? await this.metaData.extInfo.byArtist(orm, o) : undefined
		};
	}

	async artistIndex(_orm: Orm, result: IndexResult<IndexResultGroup<ORMArtist>>): Promise<ArtistIndex> {
		return this.index(result, async item => {
			return {
				id: item.id,
				name: item.name,
				albumCount: await item.albums.count(),
				trackCount: await item.tracks.count()
			};
		});
	}
}
