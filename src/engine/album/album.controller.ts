import {JamRequest} from '../../api/jam/api';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {paginate} from '../../utils/paginate';
import {BaseListController} from '../base/dbobject-list.controller';
import {ListResult} from '../base/list-result';
import {DownloadService} from '../download/download.service';
import {ImageService} from '../image/image.service';
import {formatAlbumIndex} from '../index/index.format';
import {IndexService} from '../index/index.service';
import {MetaDataService} from '../metadata/metadata.service';
import {StateService} from '../state/state.service';
import {TrackController} from '../track/track.controller';
import {Track} from '../track/track.model';
import {User} from '../user/user.model';
import {formatAlbum} from './album.format';
import {Album} from './album.model';
import {AlbumService} from './album.service';
import {SearchQueryAlbum} from './album.store';

export class AlbumController extends BaseListController<JamParameters.Album,
	JamParameters.Albums,
	JamParameters.IncludesAlbum,
	SearchQueryAlbum,
	JamParameters.AlbumSearch,
	Album,
	Jam.Album,
	JamParameters.AlbumList> {

	constructor(
		public albumService: AlbumService,
		private trackController: TrackController,
		private metaDataService: MetaDataService,
		protected indexService: IndexService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(albumService, stateService, imageService, downloadService);
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
			try {
				result.info = await this.metaDataService.extInfo.byAlbum(album);
			} catch (e) {
				result.info = undefined;
			}
		}
		if (includes.albumTracks) {
			result.tracks = await this.trackController.prepareListByIDs(album.trackIDs, includes, user, (a, b) => this.sortAlbumTracks(a, b));
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
			rootIDs: query.rootIDs,
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

	async similarTracks(req: JamRequest<JamParameters.SimilarTracks>): Promise<ListResult<Jam.Track>> {
		const album = await this.byID(req.query.id);
		try {
			const tracks = await this.metaDataService.similarTracks.byAlbum(album);
			const list = paginate(tracks, req.query.amount, req.query.offset);
			return {
				total: list.total,
				amount: list.amount,
				offset: list.offset,
				items: await this.trackController.prepareList(list.items, req.query, req.user)
			};
		} catch (e) {
			return {total: 0, amount: req.query.amount, offset: req.query.offset, items: []};
		}
	}

	async tracks(req: JamRequest<JamParameters.Tracks>): Promise<ListResult<Jam.Track>> {
		const albums = await this.byIDs(req.query.ids);
		let trackIDs: Array<string> = [];
		albums.forEach(album => {
			trackIDs = trackIDs.concat(album.trackIDs);
		});
		return {items: await this.trackController.prepareListByIDs(trackIDs, req.query, req.user, (a, b) => this.sortAlbumTracks(a, b))};
	}

	async info(req: JamRequest<JamParameters.ID>): Promise<Jam.Info> {
		const album = await this.byID(req.query.id);
		return {info: await this.metaDataService.extInfo.byAlbum(album)};
	}

	async index(req: JamRequest<JamParameters.AlbumSearch>): Promise<Jam.AlbumIndex> {
		return formatAlbumIndex(await this.indexService.getAlbumIndex(await this.translateQuery(req.query, req.user)));
	}

}
