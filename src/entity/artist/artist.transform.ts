import {Inject, InRequestScope} from 'typescript-ioc';
import {BaseTransformService} from '../base/base.transform.js';
import {Orm} from '../../modules/engine/services/orm.service.js';
import {Artist as ORMArtist} from './artist.js';
import {IncludesArtistArgs} from './artist.args.js';
import {User} from '../user/user.js';
import {ArtistBase, ArtistIndex} from './artist.model.js';
import {DBObjectType} from '../../types/enums.js';
import {IndexResult, IndexResultGroup} from '../base/base.js';
import {MetaDataService} from '../metadata/metadata.service.js';
import {GenreTransformService} from '../genre/genre.transform.js';

@InRequestScope
export class ArtistTransformService extends BaseTransformService {
	@Inject
	public metaData!: MetaDataService;
	@Inject
	public Genre!: GenreTransformService;

	async artistBases(orm: Orm, list: Array<ORMArtist>, artistArgs: IncludesArtistArgs, user: User): Promise<Array<ArtistBase>> {
		return await Promise.all(list.map(t => this.artistBase(orm, t, artistArgs, user)));
	}

	async artistBase(orm: Orm, o: ORMArtist, artistArgs: IncludesArtistArgs, user: User): Promise<ArtistBase> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			albumCount: artistArgs.artistIncAlbumCount ? await o.albums.count() : undefined,
			trackCount: artistArgs.artistIncTrackCount ? await o.tracks.count() : undefined,
			seriesCount: artistArgs.artistIncSeriesCount ? await o.series.count() : undefined,
			mbArtistID: o.mbArtistID,
			genres: artistArgs.artistIncGenres ? await this.Genre.genreBases(orm, await o.genres.getItems(), {}, user) : undefined,
			albumTypes: o.albumTypes,
			state: artistArgs.artistIncState ? await this.state(orm, o.id, DBObjectType.artist, user.id) : undefined,
			trackIDs: artistArgs.artistIncTrackIDs ? await o.tracks.getIDs() : undefined,
			albumIDs: artistArgs.artistIncAlbumIDs ? await o.albums.getIDs() : undefined,
			seriesIDs: artistArgs.artistIncSeriesIDs ? await o.series.getIDs() : undefined,
			info: artistArgs.artistIncInfo ? await this.metaData.extInfo.byArtist(orm, o) : undefined
		};
	}

	async artistIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMArtist>>): Promise<ArtistIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				albumCount: await item.albums.count(),
				trackCount: await item.tracks.count()
			};
		});
	}


}
