import {JamRequest} from '../../api/jam/api';
import {DBObjectType} from '../../db/db.types';
import {DownloadService} from '../../engine/download/download.service';
import {ImageService} from '../../engine/image/image.service';
import {formatAlbumIndex, formatArtistIndex} from '../../engine/index/index.format';
import {IndexService} from '../../engine/index/index.service';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {paginate} from '../../utils/paginate';
import {BaseListController} from '../base/base.list.controller';
import {MetaDataService} from '../metadata/metadata.service';
import {StateService} from '../state/state.service';
import {TrackController} from '../track/track.controller';
import {Track} from '../track/track.model';
import {User} from '../user/user.model';
import {formatAlbum} from './album.format';
import {Album} from './album.model';
import {AlbumService} from './album.service';
import {SearchQueryAlbum} from './album.store';

export class AlbumController extends BaseListController<JamParameters.Album, JamParameters.Albums, JamParameters.IncludesAlbum, SearchQueryAlbum, JamParameters.AlbumSearch, Album, Jam.Album> {

	constructor(
		private albumService: AlbumService,
		private trackController: TrackController,
		private metaDataService: MetaDataService,
		protected indexService: IndexService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(albumService, stateService, imageService, downloadService);
	}

	defaultSort(items: Array<Album>): Array<Album> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
	}

	sortAlbumTracks(a: Track, b: Track): number {
		let res = (a.tag.disc || 0) - (b.tag.disc || 0);
		if (res === 0) {
			res = (a.tag.track || 0) - (b.tag.track || 0);
		}
		return res;
	}

	async prepare(album: Album, includes: JamParameters.IncludesAlbum, user: User): Promise<Jam.Album> {
		const result = formatAlbum(album, includes);
		if (includes.albumState) {
			result.state = await this.stateService.findOrCreate(album.id, user.id, DBObjectType.album);
		}
		if (includes.albumInfo) {
			result.info = await this.metaDataService.getAlbumInfo(album);
		}
		if (includes.albumTracks) {
			result.tracks = await this.trackController.prepareListByIDs(album.trackIDs, includes, user, this.sortAlbumTracks);
		}
		return result;
	}

	async translateQuery(query: JamParameters.AlbumSearch, user: User): Promise<SearchQueryAlbum> {
		return {
			query: query.query,
			id: query.id,
			ids: query.ids,
			name: query.name,
			rootID: query.rootID,
			artist: query.artist,
			artistID: query.artistID,
			trackID: query.trackID,
			mbAlbumID: query.mbAlbumID,
			mbArtistID: query.mbArtistID,
			albumType: query.albumType,
			albumTypes: query.albumTypes,
			genre: query.genre,
			newerThan: query.newerThan,
			fromYear: query.fromYear,
			toYear: query.toYear,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async similarTracks(req: JamRequest<JamParameters.SimilarTracks>): Promise<Array<Jam.Track>> {
		const album = await this.byID(req.query.id);
		const tracks = await this.metaDataService.getAlbumSimilarTracks(album);
		return this.trackController.prepareList(paginate(tracks, req.query.amount, req.query.offset), req.query, req.user);
	}

	async list(req: JamRequest<JamParameters.AlbumList>): Promise<Array<Jam.Album>> {
		return this.getList(req.query, req.query, req.query, req.user);
	}

	async tracks(req: JamRequest<JamParameters.Tracks>): Promise<Array<Jam.Track>> {
		const albums = await this.byIDs(req.query.ids);
		let trackIDs: Array<string> = [];
		albums.forEach(album => {
			trackIDs = trackIDs.concat(album.trackIDs);
		});
		return this.trackController.prepareListByIDs(trackIDs, req.query, req.user, this.sortAlbumTracks);
	}

	async info(req: JamRequest<JamParameters.ID>): Promise<Jam.Info> {
		const album = await this.byID(req.query.id);
		return {info: await this.metaDataService.getAlbumInfo(album)};
	}

	async index(req: JamRequest<JamParameters.AlbumSearch>): Promise<Jam.AlbumIndex> {
		return formatAlbumIndex(await this.indexService.getAlbumIndex(await this.translateQuery(req.query, req.user)));
	}

}
